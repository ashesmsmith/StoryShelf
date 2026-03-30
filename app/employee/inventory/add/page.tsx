'use client';

import { useState, FormEvent } from 'react';
import { createBook } from './actions';
import BookImage from '@/components/BookImage';

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
            console.log('Google Books API response:', data);
            setGoogleBook(data || null);
        } catch (err) {
            console.error('Error fetching book:', err);
            setGoogleBook(null);
        } finally {
            setLoading(false);
        }
    };

    // Format published date for <input type="date">
    const formattedDate =
        googleBook?.publishedDate && googleBook.publishedDate.length === 10
            ? googleBook.publishedDate
            : googleBook?.publishedDate && googleBook.publishedDate.length === 4
              ? `${googleBook.publishedDate}-01-01`
              : '';

    // Combine categories into comma-separated string for input
    const prefillCategories = googleBook?.categories?.join(', ') || '';

    // Normalize printType for <select>
    const normalizedPrintType = (() => {
        const pt = googleBook?.printType?.toUpperCase() || '';
        if (pt === 'HARDCOVER') return 'HARDCOVER';
        if (pt === 'PAPERBACK') return 'PAPERBACK';
        return ''; // default fallback
    })();

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
            <div className="relative h-40 w-28 mx-auto mb-6">
                <BookImage
                    src={googleBook?.imageLinks?.thumbnail || '/book_placeholder.png'}
                    alt={googleBook?.title || 'Book cover'}
                />
            </div>

            {/* Book Form */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
                <form action={createBook} className="flex flex-col gap-6">
                    {/* ISBN (read-only) */}
                    <label>ISBN</label>
                    <input
                        name="isbn"
                        defaultValue={googleBook?.isbn || ''}
                        readOnly
                        className="rounded-xl border border-[#cad2c5] px-4 py-3 bg-[#f0f0f0]"
                    />

                    {/* Title */}
                    <label>Title</label>
                    <input
                        name="title"
                        placeholder="Title"
                        defaultValue={googleBook?.title || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Author */}
                    <label>Author</label>
                    <input
                        name="author"
                        placeholder="Author"
                        defaultValue={googleBook?.authors?.[0] || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Description */}
                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        defaultValue={googleBook?.description || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Page Count */}
                    <label>Page Count</label>
                    <input
                        name="pageCount"
                        type="number"
                        placeholder="Length (pages)"
                        defaultValue={googleBook?.pageCount || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Print Type */}
                    <label>Print Type</label>
                    <select
                        name="printType"
                        defaultValue={normalizedPrintType}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    >
                        <option value="">Select type</option>
                        <option value="HARDCOVER">Hardcover</option>
                        <option value="PAPERBACK">Paperback</option>
                    </select>

                    {/* Categories */}
                    <label>Categories</label>
                    <input
                        name="categories"
                        placeholder="Categories (comma separated)"
                        defaultValue={prefillCategories}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Publisher */}
                    <label>Publisher</label>
                    <input
                        name="publisher"
                        placeholder="Publishing Company"
                        defaultValue={googleBook?.publisher || ''}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Published Date */}
                    <label>Published Date</label>
                    <input
                        name="publishedDate"
                        type="date"
                        defaultValue={formattedDate}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Price */}
                    <label>Price*</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        required
                        min={0.01}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Stock Quantity */}
                    <label>Stock Quantity*</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        placeholder="Stock Quantity"
                        required
                        min={0}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    {/* Submit */}
                    <button className="rounded-xl bg-[#2f3e46] px-6 py-3 text-white">
                        Save Book
                    </button>
                </form>
            </div>
        </main>
    );
}
