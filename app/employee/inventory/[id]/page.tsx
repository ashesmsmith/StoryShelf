import { notFound } from "next/navigation";
import { updateInventory } from "../actions";

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    stockQuantity: number;
    };

    // 🔒 Mock data (replace with DB query later)
    const inventory: Book[] = [
    {
        id: 1,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        price: 18.99,
        stockQuantity: 12,
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 21.5,
        stockQuantity: 8,
    },
    {
        id: 3,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 19.25,
        stockQuantity: 0,
    },
];

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

export default async function UpdateInventoryPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    const bookId = parseInt(id);
    const book = inventory.find((b) => b.id === bookId);

    if (!book) return notFound();

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            {/* Header */}
            <div className="mb-10">
                <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                Inventory Update
                </span>

                <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">
                Update Stock
                </h1>

                <p className="mt-2 text-[#52796f]">
                Modify inventory for this book
                </p>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
                {/* Book Info */}
                <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#2f3e46]">
                    {book.title}
                </h2>
                <p className="text-[#52796f]">{book.author}</p>

                <div className="mt-3 text-sm text-[#354f52]">
                    Price: {formatPrice(book.price)}
                </div>
                </div>

                {/* Form */}
                <form action={updateInventory} className="flex flex-col gap-6">
                    <input type="hidden" name="id" value={book.id} />

                    <div>
                        <label className="block text-sm font-medium text-[#354f52]">
                        Stock Quantity
                        </label>
                        <input
                        type="number"
                        name="stockQuantity"
                        defaultValue={book.stockQuantity}
                        className="mt-2 w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                        min={0}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                        type="submit"
                        className="rounded-xl bg-[#2f3e46] px-6 py-3 font-semibold text-white"
                        >
                        Save Changes
                        </button>

                        <a
                        href="/employee/inventory"
                        className="rounded-xl border border-[#354f52] px-6 py-3 font-semibold text-[#354f52]"
                        >
                        Cancel
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}