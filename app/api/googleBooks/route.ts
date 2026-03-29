import type { NextRequest } from 'next/server';

type IndustryIdentifier = {
    type: string;
    identifier: string;
};
type GoogleBook = {
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
}
type GoogleBookAPIResponse = {
    items: GoogleBook[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get('query')?.trim() || '';
    const page = parseInt(searchParams.get('page') || '1');  
    const limit = parseInt(searchParams.get('limit') || '12');
    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

    if (!query) {
        return new Response(JSON.stringify({ items: [], totalItems: 0 }), { status: 200 });
    }

    // Detect ISBN (10 or 13 digits)
    if (/^\d{10}(\d{3})?$/.test(query.replace(/-/g, ''))) {
        query = `isbn:${query.replace(/-/g, '')}`;
    }

    const startIndex = (page - 1) * limit;
    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
        );

        const data = await res.json();
        const items: GoogleBook[] = (data.items || []).map((item: any) => {
            const volumeInfo = item.volumeInfo || {};
            const identifiers: IndustryIdentifier[] = volumeInfo.industryIdentifiers || [];

            const isbn13 = identifiers.find((id) => id.type === 'ISBN_13')?.identifier;
            const isbn10 = identifiers.find((id) => id.type === 'ISBN_10')?.identifier;
            const isbn = isbn13 || isbn10 || '';

            return {
                isbn,
                title: volumeInfo.title || '',
                authors: volumeInfo.authors || [],
                description: volumeInfo.description || '',
                pageCount: volumeInfo.pageCount || undefined,
                printType: volumeInfo.printType || '',
                categories: volumeInfo.categories || [],
                publisher: volumeInfo.publisher || '',
                publishedDate: volumeInfo.publishedDate || '',
                imageLinks: {
                    thumbnail: volumeInfo.imageLinks?.thumbnail || '',
                },
            };
        });

        const response: GoogleBookAPIResponse = {
            items,
            totalItems: data.totalItems || 0,
            page,
            limit,
            totalPages: Math.ceil((data.totalItems || 0) / limit),
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (err) {
        console.error('Google Books API error:', err);
        return new Response(JSON.stringify({ 
            items: [], 
            totalItems: 0, 
            page, 
            limit, 
            totalPages: 0 
        }), { status: 500 });
    }
}
