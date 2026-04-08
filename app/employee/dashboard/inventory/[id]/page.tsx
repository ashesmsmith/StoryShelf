import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateBook } from './actions';
import Link from 'next/link';

export default async function EditBookPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams?: { duplicate?: string };
}) {
    const { id } = await params;
    const bookId = Number(id);
    if (!bookId) return notFound();

    const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
            inventory: true,
            categories: { include: { category: true } },
        },
    });
    if (!book) return notFound();

    const formattedDate = book.publishedDate
        ? new Date(book.publishedDate).toISOString().split('T')[0]
        : '';

    const categoryList = book.categories.map((c) => c.category.name).join(', ');

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            {/* Header */}
            <div className="mb-10">
                <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                    Edit Book
                </span>
                <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">Update Book Details</h1>
                <p className="mt-2 text-[#52796f]">
                    Modify details, inventory, and featured status
                </p>
                {searchParams?.duplicate && (
                    <p className="mt-3 text-yellow-600 font-medium">
                        This book already exists. You can update it here.
                    </p>
                )}
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
                <form action={updateBook} className="flex flex-col gap-6">
                    <input type="hidden" name="id" value={book.id} />

                    {/* ISBN (disabled) */}
                    <label>ISBN</label>
                    <input
                        value={book.isbn}
                        disabled
                        className="rounded-xl border px-4 py-3 bg-gray-100"
                    />

                    <label>Title</label>
                    <input
                        name="title"
                        defaultValue={book.title}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Author</label>
                    <input
                        name="author"
                        defaultValue={book.author}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        defaultValue={book.description || ''}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Page Count</label>
                    <input
                        name="pageCount"
                        type="number"
                        defaultValue={book.pageCount || ''}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Print Type</label>
                    <select
                        name="printType"
                        defaultValue={book.printType || ''}
                        className="rounded-xl border px-4 py-3"
                    >
                        <option value="">Select type</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Paperback">Paperback</option>
                    </select>

                    <label>Categories</label>
                    <input
                        name="categories"
                        defaultValue={categoryList}
                        placeholder="Comma separated"
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Publisher</label>
                    <input
                        name="publisher"
                        defaultValue={book.publisher || ''}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Published Date</label>
                    <input
                        name="publishedDate"
                        type="date"
                        defaultValue={formattedDate}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Price</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={book.price}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>Stock Quantity</label>
                    <input
                        name="stockQuantity"
                        type="number"
                        defaultValue={book.inventory?.quantity || 0}
                        className="rounded-xl border px-4 py-3"
                    />

                    <label>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            defaultChecked={book.isFeatured}
                            className="mr-2"
                        />
                        Featured
                    </label>

                    <div className="flex gap-4">
                        <button className="rounded-xl bg-[#2f3e46] px-6 py-3 text-white">
                            Save Changes
                        </button>
                        <Link
                            href="/employee/dashboard/inventory"
                            className="rounded-xl border px-6 py-3"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
