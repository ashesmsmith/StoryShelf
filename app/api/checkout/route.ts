import { NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { recalcOrderTotals } from '@/lib/utils/order';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        const userId = 2; // authenticated user

        // Fetch cart order
        const cartOrder = await prisma.order.findFirst({
            where: { userId, status: OrderStatus.PENDING, paymentStatus: 'PENDING' },
        });
        if (!cartOrder) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

        const cartItems = await prisma.orderItem.findMany({
            where: { orderId: cartOrder.id },
            include: { book: { include: { inventory: true } } },
        });

        if (!cartItems.length)
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

        // Check inventory
        for (const item of cartItems) {
            if (!item.book.inventory || item.quantity > item.book.inventory.quantity) {
                return NextResponse.json(
                    { error: `Not enough stock for ${item.book.title}` },
                    { status: 400 }
                );
            }
        }

        // Recalculate totals
        const totals = await recalcOrderTotals(cartOrder.id);

        // Create finalized order
        const shippingInfo = {
            shippingFirstName: 'John',
            shippingLastName: 'Doe',
            shippingStreet: '123 Main St',
            shippingCity: 'Los Angeles',
            shippingState: 'CA',
            shippingZip: '90001',
            shippingCountry: 'USA',
        };

        const order = await prisma.order.update({
            where: { id: cartOrder.id },
            data: {
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                ...totals,
                ...shippingInfo,
            },
        });

        // Deduct inventory
        for (const item of cartItems) {
            await prisma.inventory.update({
                where: { bookId: item.bookId },
                data: { quantity: item.book.inventory!.quantity - item.quantity },
            });
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
    }
}
