import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            isbn,
            title,
            authors,
            description,
            imageURL,
            pageCount,
            printType,
            publisher,
            publishedDate,
            categories = [],
        } = body;

        if (!isbn || !title) {
            return new Response(
                JSON.stringify({ error: 'ISBN and title are required' }),
                { status: 400 }
            );
        }

        const existingBook = await prisma.book.findUnique({
            where: { isbn },
        });

        if (existingBook) {
            return new Response(
                JSON.stringify({
                    message: 'Book already exists',
                    book: existingBook,
                }),
                { status: 200 }
            );
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let parsedDate: Date | undefined = undefined;
        if (publishedDate) {
            const date = new Date(publishedDate);
            if (!isNaN(date.getTime())) {
                parsedDate = date;
            }
        }

        const categoryConnections = [];

        for (const cat of categories) {
            const slug = cat
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            let category = await prisma.category.findUnique({
                where: { slug },
            });

            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: cat,
                        slug,
                    },
                });
            }

            categoryConnections.push({
                categoryId: category.id,
            });
        }

        const newBook = await prisma.book.create({
            data: {
                isbn,
                title,
                author: authors?.join(', ') || 'Unknown',
                description,
                imageURL,
                price: 0,
                slug,

                pageCount,
                printType,
                publisher,
                publishedDate: parsedDate,

                inventory: {
                    create: {
                        quantity: 0,
                    },
                },

                categories: {
                    create: categoryConnections,
                },
            },
            include: {
                inventory: true,
                categories: true,
            },
        });

        return new Response(JSON.stringify(newBook), { status: 201 });
    } catch (error) {
        console.error('IMPORT BOOK ERROR:', error);

        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}