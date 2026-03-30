'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function updateBook(formData: FormData) {
    const id = parseInt(formData.get('id') as string);

    const title = String(formData.get('title') || '');
    const author = String(formData.get('author') || '');
    const description = String(formData.get('description') || '');
    const pageCount = parseInt(formData.get('pageCount') as string) || null;
    const printType = String(formData.get('printType') || '');
    const publisher = String(formData.get('publisher') || '');

    const publishedDateInput = String(formData.get('publishedDate') || '');
    const publishedDate = publishedDateInput ? new Date(publishedDateInput) : null;

    const price = parseFloat(formData.get('price') as string);
    const stockQuantity = parseInt(formData.get('stockQuantity') as string);
    const isFeatured = !!formData.get('isFeatured');

    // Categories
    const categoryNames = String(formData.get('categories') || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

    const categories = await Promise.all(
        categoryNames.map((name) =>
            prisma.category.upsert({
                where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
                update: {},
                create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
            })
        )
    );

    // Update book
    await prisma.book.update({
        where: { id },
        data: {
            title,
            author,
            description,
            pageCount,
            printType,
            publisher,
            publishedDate,
            price,
            isFeatured,
            categories: {
                deleteMany: {}, // remove old relations
                create: categories.map((c) => ({ category: { connect: { id: c.id } } })),
            },
        },
    });

    // Update inventory
    await prisma.inventory.update({
        where: { bookId: id },
        data: { quantity: stockQuantity },
    });

    redirect('/employee/inventory');
}
