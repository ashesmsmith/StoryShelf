'use client';

import { useState, FormEvent } from 'react';
import { createBook } from './actions';
import BookImage from '@/components/BookImage';

type GoogleBook = {
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

export default function AddBookPage() {
    const [query, setQuery] = useState('');
    const [googleBook, setGoogleBook] = useState<GoogleBook | null>(null);
    const [loading, setLoading] = useState(false);

    // Client-side search handler
    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/googleBooks?query=${encodeURIComponent(query)}`);
            const data: GoogleBook | null = await res.json();
            console.log('Google Books API response:', data); //TEMPORARY LOG
            setGoogleBook(data || null);
        } catch (err) {
            console.error('Error fetching book:', err);
            setGoogleBook(null);
        } finally {
            setLoading(false);
        }
    };

    // Format published date for input (if it's in YYYY or YYYY-MM-DD format)
    const formattedDate =
        googleBook?.publishedDate && googleBook.publishedDate.length === 10
            ? googleBook.publishedDate
            : googleBook?.publishedDate && googleBook.publishedDate.length === 4
              ? `${googleBook.publishedDate}-01-01`
              : '';

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">Add to Inventory</h1>
                <p className="mt-2 text-[#52796f]">Search or manually enter book details</p>
            </div>

            {/* Google Books Search */}
            <form onSubmit={handleSearch} className="mb-8 flex gap-3">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    name="query"
                    placeholder="Search by title or ISBN"
                    className="w-full rounded-xl border border-[#cad2c5] px-4 py-3"
                />
                <button type="submit" className="rounded-xl bg-[#52796f] px-5 py-3 text-white">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Book Cover */}
            <div className="relative h-40 w-28 mx-auto">
                <BookImage
                    src={googleBook?.imageLinks?.thumbnail || '/book_placeholder.png'}
                    alt={googleBook?.title || 'Book cover'}
                />
            </div>

            {/* Book Form */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
                <form action={createBook} className="flex flex-col gap-6">
                    <label>Title</label>
                    <input
                        name="title"
                        placeholder="Title"
                        defaultValue={googleBook?.title || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Author</label>
                    <input
                        name="author"
                        placeholder="Author"
                        defaultValue={googleBook?.authors?.[0] || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        defaultValue={googleBook?.description || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Page Count</label>
                    <input
                        name="pageCount"
                        type="number"
                        placeholder="Length (pages)"
                        defaultValue={googleBook?.pageCount || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Print Type</label>
                    <select
                        name="printType"
                        defaultValue={googleBook?.printType || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    >
                        <option value="">Select type</option>
                        <option value="HARDCOVER">Hardcover</option>
                        <option value="PAPERBACK">Paperback</option>
                        <option value="BOOK">Book</option>
                    </select>

                    {/* Categories */}
                    <label>Categories</label>
                    <input
                        name="categories"
                        placeholder="Existing category IDs (comma separated)"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* New categories from Google or manual input */}
                    <input
                        name="newCategories"
                        placeholder="New categories (comma separated)"
                        defaultValue={googleBook?.categories?.join(', ') || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Publisher</label>
                    <input
                        name="publisher"
                        placeholder="Publishing Company"
                        defaultValue={googleBook?.publisher || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Published Date</label>
                    <input
                        name="publishedDate"
                        type="date"
                        defaultValue={formattedDate}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Price</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Stock Quantity</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        placeholder="Stock Quantity"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <button className="rounded-xl bg-[#2f3e46] px-6 py-3 text-white">
                        Save Book
                    </button>
                </form>
            </div>
        </main>
    );
}
