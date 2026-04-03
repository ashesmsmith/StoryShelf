import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

const USER_ID = 2; // Placeholder for authenticated user ID, replace with actual auth logic

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get('session_id');
        if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const orderId = session.metadata?.orderId;

        if (!orderId)
            return NextResponse.json({ error: 'Order ID not found in session' }, { status: 400 });

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId, 10) },
            include: { items: { include: { book: true } } },
        });

        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        const pendingOrder = await prisma.order.findFirst({
            where: {
                userId: USER_ID,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
            },
        });

        if (pendingOrder) {
            await prisma.orderItem.deleteMany({ where: { orderId: pendingOrder.id } });
        }

        return NextResponse.json({ order });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
