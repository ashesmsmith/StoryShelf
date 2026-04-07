'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/utils/slug';

export async function createBook(formData: FormData) {
    const isbn = String(formData.get('isbn') || '');

    if (!isbn) {
        throw new Error('ISBN is required');
    }

    // Check for existing book by ISBN before creating a new one
    const existingBook = await prisma.book.findUnique({ where: { isbn } });
    if (existingBook) {
        redirect(`/employee/dashboard/inventory/${existingBook.id}`);
    }

    const title = String(formData.get('title') || '');
    const author = String(formData.get('author') || '');
    const description = String(formData.get('description') || '');
    const pageCount = parseInt(formData.get('pageCount')?.toString() || '0') || null;
    const printType = String(formData.get('printType') || null);
    const publisher = String(formData.get('publisher') || null);
    const publishedDateInput = String(formData.get('publishedDate') || '');
    const publishedDate = publishedDateInput ? new Date(publishedDateInput) : null;
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const stockQuantity = parseInt(formData.get('stockQuantity')?.toString() || '0');

    // Parse categories (comma-separated input)
    const categoryNames = String(formData.get('categories') || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

    // Upsert categories first
    const categories = await Promise.all(
        categoryNames.map((name) =>
            prisma.category.upsert({
                where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
                update: {},
                create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
            })
        )
    );

    // Generate slug (title + isbn) for uniqueness and SEO
    const slug = generateSlug(title, isbn);

    // Create book with inventory and categories
    await prisma.book.create({
        data: {
            title,
            author,
            description,
            price,
            pageCount,
            printType,
            publisher,
            publishedDate,
            slug,
            isbn,
            inventory: {
                create: { quantity: stockQuantity },
            },
            categories: {
                create: categories.map((c) => ({
                    category: { connect: { id: c.id } },
                })),
            },
        },
    });

    // Redirect to inventory after submission
    redirect('/employee/dashboard/inventory');
}
