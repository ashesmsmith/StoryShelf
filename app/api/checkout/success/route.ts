import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionId = req.nextUrl.searchParams.get('session_id');
        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const orderId = session.metadata?.orderId;
        const sessionUserId = session.metadata?.userId;

        if (!orderId || !sessionUserId) {
            return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 });
        }

        if (sessionUserId !== user.id.toString()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(orderId, 10),
                userId: user.id,
            },
            include: { items: { include: { book: true } } },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.paymentStatus !== PaymentStatus.PAID) {
            return NextResponse.json({ error: 'Payment not completed yet' }, { status: 400 });
        }

        const pendingOrder = await prisma.order.findFirst({
            where: {
                userId: user.id,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
            },
        });

        if (pendingOrder && pendingOrder.id !== order.id) {
            await prisma.orderItem.deleteMany({
                where: { orderId: pendingOrder.id },
            });
        }

        return NextResponse.json({ order });
    } catch (err) {
        console.error('Checkout success error: ', err);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
