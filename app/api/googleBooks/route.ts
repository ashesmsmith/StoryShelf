import type { NextRequest } from 'next/server';

type IndustryIdentifier = {
    type: string;
    identifier: string;
};

type GoogleBookAPIResponse = {
    isbn?: string;
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    printType?: string;
    categories?: string[];
    publisher?: string;
    publishedDate?: string;
    imageLinks?: {
        thumbnail?: string;
    };
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get('query')?.trim() || '';
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    if (!query) {
        return new Response(JSON.stringify(null), { status: 200 });
    }

    // Detect ISBN (10 or 13 digits)
    if (/^\d{10}(\d{3})?$/.test(query.replace(/-/g, ''))) {
        query = `isbn:${query.replace(/-/g, '')}`;
    }

    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
        );

        const data = await res.json();
        const book = data.items?.[0]?.volumeInfo;

        if (!book) return new Response(JSON.stringify(null), { status: 200 });

        // Extract ISBN
        const identifiers: IndustryIdentifier[] = book.industryIdentifiers || [];
        const isbn13 = identifiers.find((id) => id.type === 'ISBN_13')?.identifier;
        const isbn10 = identifiers.find((id) => id.type === 'ISBN_10')?.identifier;
        const isbn = isbn13 || isbn10 || '';

        const result: GoogleBookAPIResponse = {
            isbn,
            title: book.title || '',
            authors: book.authors || [],
            description: book.description || '',
            pageCount: book.pageCount || null,
            printType: book.printType || '',
            categories: book.categories || [],
            publisher: book.publisher || '',
            publishedDate: book.publishedDate || '',
            imageLinks: {
                thumbnail: book.imageLinks?.thumbnail || '',
            },
        };

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (err) {
        console.error('Google Books API error:', err);
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
