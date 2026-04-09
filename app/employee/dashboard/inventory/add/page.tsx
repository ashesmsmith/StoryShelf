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
    imageLinks?: { thumbnail?: string };
};

export default function AddBookPage() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
    const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
    const [loading, setLoading] = useState(false);

    // Handle search button click
    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/googleBooks?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data.items || []);
            setSelectedBook(null); // reset previous selection
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Fill form when user selects a book
    const handleSelectBook = (book: GoogleBook) => {
        setSelectedBook(book);
        setSearchResults([]);
    };

    // Format date for <input type="date">
    const formattedDate =
        selectedBook?.publishedDate && selectedBook.publishedDate.length === 10
            ? selectedBook.publishedDate
            : selectedBook?.publishedDate && selectedBook.publishedDate.length === 4
              ? `${selectedBook.publishedDate}-01-01`
              : '';

    const prefillCategories = selectedBook?.categories?.join(', ') || '';

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <div className="mb-10">
                <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">Add to Inventory</h1>
                <p className="mt-2 text-[#52796f]">Search or manually enter book details</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-3 relative">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or ISBN"
                    className="w-full rounded-xl border border-[#cad2c5] px-4 py-3"
                />
                <button type="submit" className="rounded-xl bg-[#52796f] px-5 py-3 text-white">
                    {loading ? 'Searching...' : 'Search'}
                </button>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <ul className="absolute top-full left-0 z-10 max-h-60 w-full overflow-auto rounded-xl border border-[#cad2c5] bg-white shadow-lg">
                        {searchResults.map((book, index) => (
                            <li
                                key={index}
                                className="cursor-pointer px-4 py-2 hover:bg-[#f0f4f3]"
                                onClick={() => handleSelectBook(book)}
                            >
                                {book.title} {book.authors ? `- ${book.authors.join(', ')}` : ''}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            {/* Book Cover */}
            <div className="relative h-40 w-28 mx-auto mb-6">
                <BookImage
                    src={selectedBook?.imageLinks?.thumbnail || '/book_placeholder.png'}
                    alt={selectedBook?.title || 'Book cover'}
                />
            </div>

            {/* Book Form */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
                <form action={createBook} className="flex flex-col gap-6">
                    <label>ISBN</label>
                    <input
                        name="isbn"
                        defaultValue={selectedBook?.isbn || ''}
                        readOnly
                        className="rounded-xl border border-[#cad2c5] px-4 py-3 bg-[#f0f0f0]"
                    />

                    <label>Title</label>
                    <input
                        name="title"
                        defaultValue={selectedBook?.title || ''}
                        placeholder="Title"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Author</label>
                    <input
                        name="author"
                        defaultValue={selectedBook?.authors?.[0] || ''}
                        placeholder="Author"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        defaultValue={selectedBook?.description || ''}
                        placeholder="Description"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Page Count</label>
                    <input
                        name="pageCount"
                        type="number"
                        defaultValue={selectedBook?.pageCount || ''}
                        placeholder="Length (pages)"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Print Type</label>
                    <select
                        name="printType"
                        defaultValue=""
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    >
                        <option value="">Select type</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Paperback">Paperback</option>
                    </select>

                    <label>Categories</label>
                    <input
                        name="categories"
                        defaultValue={prefillCategories}
                        placeholder="Categories (comma separated)"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Publisher</label>
                    <input
                        name="publisher"
                        defaultValue={selectedBook?.publisher || ''}
                        placeholder="Publisher"
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

                    <label>Published Date</label>
                    <input
                        name="publishedDate"
                        type="date"
                        defaultValue={formattedDate}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    />

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

                    <label>Stock Quantity*</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        placeholder="Stock Quantity"
                        required
                        min={0}
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