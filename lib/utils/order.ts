import prisma from '@/lib/prisma';

/**
 * Recalculate order totals (subtotal, tax, shipping, total)
 * based on current order items.
 */
export async function recalcOrderTotals(orderId: number) {
    const items = await prisma.orderItem.findMany({ where: { orderId } });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = items.length ? 5 : 0;
    const total = subtotal + tax + shipping;

    await prisma.order.update({
        where: { id: orderId },
        data: { subtotal, tax, shipping, total },
    });

    return { subtotal, tax, shipping, total };
}
