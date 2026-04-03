// IMPORTANT
// Cart = OrderStatus PENDING + PaymentStatus PENDING
// Checkout Order = OrderStatus PROCESSING + PaymentStatus PENDING
// Paid Order = OrderStatus PROCESSING + PaymentStatus PAID

import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { recalcOrderTotals } from '@/lib/utils/order';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const userId = 2; // Placeholder for authenticated user ID

        const form = await req.json();

        const result = await prisma.$transaction(async (tx) => {
            const cartOrder = await tx.order.findFirst({
                where: {
                    userId,
                    status: OrderStatus.PENDING,
                    paymentStatus: PaymentStatus.PENDING,
                },
            });

            if (!cartOrder) {
                throw new Error('Cart is Empty');
            }

            const cartItems = await tx.orderItem.findMany({
                where: { orderId: cartOrder.id },
                include: { book: { include: { inventory: true } } },
            });

            if (!cartItems.length) {
                throw new Error('Cart is Empty');
            }

            for (const item of cartItems) {
                if (!item.book) {
                    throw new Error(`One or more items in your cart are no longer available.`);
                }

                if (!item.book.inventory) {
                    throw new Error(`Not enough stock for ${item.book.title}`);
                }

                if (item.price !== item.book.price) {
                    throw new Error(`Price for ${item.book.title} has changed.`);
                }

                if (item.quantity > item.book.inventory.quantity) {
                    throw new Error(`Not enough stock for ${item.book.title}`);
                }
            }

            const totals = await recalcOrderTotals(cartOrder.id);

            // Update OrderStatus to PROCESSING and save shipping info
            const order = await tx.order.update({
                where: { id: cartOrder.id },
                data: {
                    status: OrderStatus.PROCESSING,
                    paymentStatus: PaymentStatus.PENDING,
                    ...totals,
                    shippingFirstName: form.firstName,
                    shippingLastName: form.lastName,
                    shippingStreet: form.street,
                    shippingCity: form.city,
                    shippingState: form.state,
                    shippingZip: form.zip,
                    shippingCountry: form.country,
                },
            });

            for (const item of cartItems) {
                await tx.inventory.update({
                    where: { bookId: item.bookId },
                    data: {
                        quantity: { decrement: item.quantity },
                    },
                });
            }

            return order;
        });

        return NextResponse.json({ success: true, orderId: result.id });
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Checkout failed';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
