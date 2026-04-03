// IMPORTANT
// Cart = OrderStatus PENDING + PaymentStatus PENDING
// Checkout Order = OrderStatus PROCESSING + PaymentStatus PENDING
// Paid Order = OrderStatus PROCESSING + PaymentStatus PAID

import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { recalcOrderTotals } from '@/lib/utils/order';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const form = await req.json();

        const { order, cartItems } = await prisma.$transaction(async (tx) => {
            const cartOrder = await tx.order.findFirst({
                where: {
                    userId: user.id,
                    status: OrderStatus.PENDING,
                    paymentStatus: PaymentStatus.PENDING,
                },
            });

            if (!cartOrder) {
                throw new Error('Cart is Empty');
            }

            if (cartOrder.status !== OrderStatus.PENDING) {
                throw new Error('Order is processing...');
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
                    throw new Error(`Item no longer available.`);
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

            return { order, cartItems };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.book!.title,
                        images: item.book!.imageURL ? [item.book!.imageURL] : [],
                    },
                    unit_amount: Math.round(item.book!.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
            metadata: { orderId: order.id.toString(), userId: user.id.toString() },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Checkout failed';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
