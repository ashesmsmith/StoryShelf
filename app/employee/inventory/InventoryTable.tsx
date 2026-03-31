'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    inventory?: { quantity: number };
};

type Props = {
    initialBooks: Book[];
};

export default function InventoryTable({ initialBooks }: Props) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<'title' | 'author' | 'price' | 'stock'>('title');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const toggleOrder = (field: 'title' | 'author' | 'price' | 'stock') => {
        if (sort === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(field);
            setOrder('asc');
        }
        setPage(1); // reset to first page
    };

    const filteredBooks = useMemo(() => {
        let result = initialBooks;

        if (query) {
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(query.toLowerCase()) ||
                    b.author.toLowerCase().includes(query.toLowerCase())
            );
        }

        result = result.slice().sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sort) {
                case 'title':
                    aValue = a.title;
                    bValue = b.title;
                    break;
                case 'author':
                    aValue = a.author;
                    bValue = b.author;
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'stock':
                    aValue = a.inventory?.quantity ?? 0;
                    bValue = b.inventory?.quantity ?? 0;
                    break;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return order === 'asc'
                    ? (aValue as number) - (bValue as number)
                    : (bValue as number) - (aValue as number);
            }
        });

        return result;
    }, [initialBooks, query, sort, order]);

    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    const booksOnPage = filteredBooks.slice((page - 1) * pageSize, page * pageSize);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    return (
        <>
            {/* Search */}
            <form
                className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                onSubmit={(e) => {
                    e.preventDefault();
                    setPage(1);
                }}
            >
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full md:w-1/3 rounded-xl border border-[#cad2c5] px-4 py-2"
                />
                <button className="rounded-xl bg-[#2f3e46] px-6 py-2 text-white">Search</button>
            </form>

            {/* Empty state */}
            {booksOnPage.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-16 text-center">
                    <h2 className="text-xl font-semibold">No books found</h2>
                    <p className="mt-2 text-[#52796f]">
                        Try adjusting your search or add a new book.
                    </p>
                    <Link
                        href="/employee/inventory/add"
                        className="mt-6 rounded-xl bg-[#52796f] px-6 py-3 font-semibold text-white"
                    >
                        + Add Book
                    </Link>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#f0f4f3] text-[#354f52]">
                                <tr>
                                    {['title', 'author', 'price', 'stock', 'status', 'actions'].map(
                                        (col) => {
                                            const isSortable =
                                                col === 'title' ||
                                                col === 'author' ||
                                                col === 'price' ||
                                                col === 'stock';
                                            return (
                                                <th
                                                    key={col}
                                                    className="px-6 py-4 text-left font-semibold cursor-pointer"
                                                    onClick={() =>
                                                        isSortable &&
                                                        toggleOrder(
                                                            col as
                                                                | 'title'
                                                                | 'author'
                                                                | 'price'
                                                                | 'stock'
                                                        )
                                                    }
                                                >
                                                    {col.charAt(0).toUpperCase() + col.slice(1)}
                                                    {sort === col
                                                        ? order === 'asc'
                                                            ? ' ↑'
                                                            : ' ↓'
                                                        : null}
                                                </th>
                                            );
                                        }
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {booksOnPage.map((book) => {
                                    const stock = book.inventory?.quantity ?? 0;
                                    const isLowStock = stock > 0 && stock < 5;
                                    return (
                                        <tr
                                            key={book.id}
                                            className={`border-t ${isLowStock ? 'bg-yellow-50' : ''} hover:bg-[#f9fbfa]`}
                                        >
                                            <td className="px-6 py-4 font-medium">{book.title}</td>
                                            <td className="px-6 py-4">{book.author}</td>
                                            <td className="px-6 py-4">{formatPrice(book.price)}</td>
                                            <td className="px-6 py-4">
                                                {stock}
                                                {isLowStock && (
                                                    <span className="ml-2 text-xs text-yellow-700">
                                                        Low
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${
                                                        stock > 0
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/employee/inventory/${book.id}`}
                                                    className="rounded-lg bg-[#2f3e46] px-4 py-2 text-xs text-white"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center">
                        <span className="text-sm text-[#52796f]">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <button
                                    onClick={() => setPage(page - 1)}
                                    className="rounded-lg border px-4 py-2"
                                >
                                    Previous
                                </button>
                            )}
                            {page < totalPages && (
                                <button
                                    onClick={() => setPage(page + 1)}
                                    className="rounded-lg border px-4 py-2"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
