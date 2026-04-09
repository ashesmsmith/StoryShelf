'use server';

import prisma from '@/lib/prisma';
import { requireEmployee } from '@/lib/utils/requireEmployee';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function updateOrderStatus(formData: FormData) {
    await requireEmployee();

    const id = Number(formData.get('id'));
    const status = formData.get('status') as string;
    const paymentStatus = formData.get('paymentStatus') as string;

    if (!id || !status || !paymentStatus) return;

    await prisma.order.update({
        where: { id },
        data: { 
            status: status as OrderStatus, 
            paymentStatus: paymentStatus as PaymentStatus },
    });

    revalidatePath('/employee/dashboard/orders');
    redirect(`/employee/dashboard/orders/?updated=true`);
}