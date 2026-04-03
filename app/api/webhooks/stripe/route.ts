import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
            console.error('No order ID found in session metadata');
            return NextResponse.json({ received: true });
        }

        try {
            const order = await prisma.order.findUnique({
                where: { id: parseInt(orderId, 10) },
            });

            if (!order) {
                console.error(`Order with ID ${orderId} not found`);
                return NextResponse.json({ received: true });
            }

            if (order.paymentStatus === PaymentStatus.PAID) {
                console.log(`Order ID ${orderId} is already processed`);
                return NextResponse.json({ received: true });
            }

            const orderItems = await prisma.orderItem.findMany({
                where: { orderId: order.id },
                include: { book: { include: { inventory: true } } },
            });

            await prisma.$transaction(async (tx) => {
                for (const item of orderItems) {
                    if (!item.book || !item.book.inventory) continue;

                    await tx.inventory.updateMany({
                        where: { bookId: item.bookId, quantity: { gte: item.quantity } },
                        data: { quantity: { decrement: item.quantity } },
                    });
                }

                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: OrderStatus.PROCESSING,
                        paymentStatus: PaymentStatus.PAID,
                    },
                });
            });

            console.log(`Order paid and inventory updated for order ID ${orderId}`);
        } catch (err) {
            console.error('Failed to update order after payment', orderId, err);
        }
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
