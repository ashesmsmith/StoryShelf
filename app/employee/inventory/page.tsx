import Link from 'next/link';
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

// Mock employee
const employee = { name: 'John Employee' };

type Props = {
    searchParams: {
        query?: string;
        sort?: 'title' | 'price' | 'stock';
        order?: 'asc' | 'desc';
        page?: string;
    };
};

export default async function InventoryPage({ searchParams }: Props) {
    const query = searchParams.query || '';
    const sort = searchParams.sort || 'title';
    const order = searchParams.order || 'asc';
    const page = parseInt(searchParams.page || '1');
    const pageSize = 10;

    // 🔹 Prisma Where
    const where: Prisma.BookWhereInput = query
        ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { author: { contains: query, mode: 'insensitive' } },
            ],
        }
        : {};

    // 🔹 Order by title or price in Prisma only
    const orderBy: Prisma.BookOrderByWithRelationInput =
        sort === 'price'
            ? { price: order as Prisma.SortOrder }
            : { title: order as Prisma.SortOrder };

    // 🔹 Fetch books with inventory
    type BookWithInventory = Prisma.BookGetPayload<{ include: { inventory: true } }>;
    const [booksRaw, totalCount] = await Promise.all([
        prisma.book.findMany({
            where,
            include: { inventory: true },
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
        }) as Promise<BookWithInventory[]>,
        prisma.book.count({ where }),
    ]);

    // 🔹 Sort by stock in-memory if requested
    let books = booksRaw;
    if (sort === 'stock') {
        books = booksRaw.sort((a, b) => {
            const stockA = a.inventory?.quantity ?? 0;
            const stockB = b.inventory?.quantity ?? 0;
            return order === 'asc' ? stockA - stockB : stockB - stockA;
        });
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    // 🔹 Helper to toggle sort
    const toggleOrder = (field: string) =>
        sort === field ? (order === 'asc' ? 'desc' : 'asc') : 'asc';

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            {/* Header */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#2f3e46]">Inventory Management</h1>
                    <p className="mt-2 text-[#52796f]">
                        Welcome back, <span className="font-semibold">{employee.name}</span>
                    </p>
                </div>

                <Link
                    href="/employee/inventory/add"
                    className="rounded-xl bg-[#52796f] px-6 py-3 font-semibold text-white"
                >
                    + Add Book
                </Link>
            </div>

            {/* Search */}
            <form className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                    type="text"
                    name="query"
                    defaultValue={query}
                    placeholder="Search by title or author..."
                    className="w-full md:w-1/3 rounded-xl border border-[#cad2c5] px-4 py-2"
                />
                <button className="rounded-xl bg-[#2f3e46] px-6 py-2 text-white">Search</button>
            </form>

            {/* Empty State */}
            {books.length === 0 ? (
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
                                                col === 'price' ||
                                                col === 'stock';
                                            return (
                                                <th
                                                    key={col}
                                                    className="px-6 py-4 text-left font-semibold cursor-pointer"
                                                >
                                                    {isSortable ? (
                                                        <Link
                                                            href={`?query=${query}&sort=${col}&order=${toggleOrder(
                                                                col
                                                            )}`}
                                                        >
                                                            {col.charAt(0).toUpperCase() +
                                                                col.slice(1)}
                                                            {sort === col
                                                                ? order === 'asc'
                                                                    ? ' ↑'
                                                                    : ' ↓'
                                                                : null}
                                                        </Link>
                                                    ) : (
                                                        col.charAt(0).toUpperCase() + col.slice(1)
                                                    )}
                                                </th>
                                            );
                                        }
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {books.map((book) => {
                                    const stock = book.inventory?.quantity ?? 0;
                                    const isLowStock = stock > 0 && stock < 5;
                                    return (
                                        <tr
                                            key={book.id}
                                            className={`border-t ${
                                                isLowStock ? 'bg-yellow-50' : ''
                                            } hover:bg-[#f9fbfa]`}
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
                                <Link
                                    href={`?query=${query}&sort=${sort}&order=${order}&page=${page - 1}`}
                                    className="rounded-lg border px-4 py-2"
                                >
                                    Previous
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link
                                    href={`?query=${query}&sort=${sort}&order=${order}&page=${page + 1}`}
                                    className="rounded-lg border px-4 py-2"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
