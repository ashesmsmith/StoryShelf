// IMPORTANT: Cart = OrderStatus PENDING + PaymentStatus PENDING

import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { recalcOrderTotals } from '@/lib/utils/order';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import prisma from '@/lib/prisma';

async function getOrCreateCartOrder(userId: number) {
    let order = await prisma.order.findFirst({
        where: { userId, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.PENDING },
    });

    if (!order) {
        order = await prisma.order.create({
            data: {
                userId,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,

                // Temporary placeholder values
                shippingFirstName: '',
                shippingLastName: '',
                shippingStreet: '',
                shippingCity: '',
                shippingState: '',
                shippingZip: '',
                shippingCountry: '',
            },
        });
    }

    return order;
}

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const order = await getOrCreateCartOrder(user.id);
        const items = await prisma.orderItem.findMany({
            where: { orderId: order.id },
            include: { book: true },
        });
        return NextResponse.json({ items });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { bookId, quantity } = await req.json();
        if (!bookId || typeof quantity !== 'number')
            return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });

        const order = await getOrCreateCartOrder(user.id);

        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: { inventory: true },
        });

        if (!book)
            return NextResponse.json({ error: 'This book no longer exists.' }, { status: 404 });

        if (!book.inventory)
            return NextResponse.json(
                { error: 'This book is currently unavailable.' },
                { status: 404 }
            );

        const existingItem = await prisma.orderItem.findFirst({
            where: { bookId, orderId: order.id },
        });

        let priceChanged = false;

        if (existingItem) {
            if (quantity === 0) {
                await prisma.orderItem.delete({ where: { id: existingItem.id } });
            } else {
                if (existingItem.price !== book.price) priceChanged = true;

                await prisma.orderItem.update({
                    where: { id: existingItem.id },
                    data: { quantity, price: book.price },
                });
            }
        } else if (quantity > 0) {
            await prisma.orderItem.create({
                data: { orderId: order.id, bookId, quantity, price: book.price },
            });
        }

        const totals = await recalcOrderTotals(order.id);

        return NextResponse.json({ success: true, totals, priceChanged });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}
