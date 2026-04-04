'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

type GoogleBook = {
    isbn?: string;
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
        thumbnail?: string;
    };
};

export default function BooksClient({ initialQuery }: { initialQuery?: string }) {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const hasFetched = useRef(false);

    const fetchBooks = async (search: string) => {
        if (!search) return;

        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/googleBooks?query=${search}`);
            const data = await res.json();
            setBooks(data.items || []);
        } catch (err) {
            console.error(err);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const importBook = async (book: any) => {
        await fetch('/api/books/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isbn: book.isbn,
                title: book.title,
                authors: book.authors,
                description: book.description,
                imageURL: book.imageLinks?.thumbnail,
                pageCount: book.pageCount,
                printType: book.printType,
                publisher: book.publisher,
                publishedDate: book.publishedDate,
                categories: book.categories,
            }),
        });
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const authors = [
            'J.K. Rowling',
            'C.S. Lewis',
            'Roald Dahl',
            'Dr. Seuss',
            'Rick Riordan',
            'Beatrix Potter',
            'E.B. White',
            'Lemony Snicket',
            'Lewis Carroll',
            'Michael Ende',
        ];
        const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        console.log('Fetching books for initial query:', initialQuery);
        fetchBooks(initialQuery || randomAuthor);
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBooks(query);
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-[#2f3e46]">Book Search</h1>
                <p className="mt-2 text-[#52796f]">Search books by title, author, or ISBN.</p>
            </div>

            {/* SEARCH */}
            <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Atomic Habits or 9780735211292"
                    className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-[#2f3e46] px-6 py-3 font-semibold text-white hover:opacity-90"
                >
                    Search
                </button>
            </form>

            {/* STATES */}
            {loading && <p className="text-[#52796f]">Searching books...</p>}

            {!loading && searched && books.length === 0 && (
                <p className="text-[#52796f]">No results found.</p>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {books.map((book, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-3xl border border-[#cad2c5] bg-white shadow-sm hover:shadow-md transition"
                    >
                        {/* IMAGE */}
                        <div className="flex h-56 items-center justify-center bg-[#edf1eb]">
                            {book.imageLinks?.thumbnail ? (
                                <Image
                                    src={book.imageLinks.thumbnail}
                                    alt={book.title || 'Book'}
                                    width={200}
                                    height={200}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-[#52796f]">No Image</span>
                            )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-[#2f3e46]">{book.title}</h3>

                            <p className="mt-1 text-sm text-[#52796f]">
                                {book.authors?.join(', ') || 'Unknown author'}
                            </p>

                            {book.description && (
                                <p className="mt-3 line-clamp-3 text-sm text-[#52796f]">
                                    {book.description}
                                </p>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={() => importBook(book)}
                                    className="w-full rounded-xl bg-[#52796f] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
