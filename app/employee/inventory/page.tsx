import prisma from '@/lib/prisma';
import InventoryTable from './InventoryTable';
import Link from 'next/link';

type BookWithInventory = {
    id: number;
    title: string;
    author: string;
    price: number;
    inventory?: { quantity: number };
};

// Mock employee
const employee = { name: 'John Employee' };

export default async function InventoryPage() {
    const booksRaw = await prisma.book.findMany({
        include: { inventory: true },
    });

    // Map Prisma results so inventory is never null
    const books: BookWithInventory[] = booksRaw.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        price: b.price,
        inventory: b.inventory ? { quantity: b.inventory.quantity } : undefined,
    }));

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

            {/* Client-side interactive table */}
            <InventoryTable initialBooks={books} />
        </main>
    );
}
