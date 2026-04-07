// app/api/books/list/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search')?.trim() || '';
    const categorySlug = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    const total = await prisma.book.count({ where });

    const books = await prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        publishedDate: 'desc', 
      },
      include: {
        inventory: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return new Response(
      JSON.stringify({
        items: books,
        totalItems: total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching books list:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener los libros',
        items: [],
        totalItems: 0,
        totalPages: 0 
      }),
      { status: 500 }
    );
  }
}