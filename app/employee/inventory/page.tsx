import Link from "next/link";

type Book = {
        id: number;
        title: string;
        author: string;
        price: number;
        stockQuantity: number;
};

// 🔒 Mock employee (replace later with auth/session)
const employee = {
    name: "John Employee",
};

// 📚 Mock inventory data (replace with DB later)
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

export default function InventoryPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            {/* Header */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                Employee Dashboard
                </span>

                <h1 className="mt-4 text-4xl font-bold text-[#2f3e46]">
                Inventory Management
                </h1>

                <p className="mt-2 text-[#52796f]">
                Welcome back, <span className="font-semibold">{employee.name}</span>
                </p>
            </div>

            {/* ✅ Add Book Button */}
            <Link
                href="/employee/inventory/add"
                className="inline-flex items-center justify-center rounded-xl bg-[#52796f] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
                + Add Book
            </Link>
            </div>

            {/* Inventory List */}
            <div className="grid grid-cols-1 gap-6">
                {inventory.map((book) => (
                <div
                    key={book.id}
                    className="flex flex-col justify-between gap-4 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm md:flex-row md:items-center"
                >
                    {/* Book Info */}
                    <div>
                    <h2 className="text-xl font-semibold text-[#2f3e46]">
                        {book.title}
                    </h2>
                    <p className="text-[#52796f]">{book.author}</p>

                    <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-[#354f52]">
                        Price: {formatPrice(book.price)}
                        </span>
                        <span className="text-[#354f52]">
                        Stock: {book.stockQuantity}
                        </span>
                        <span
                        className={`rounded-full px-3 py-1 font-medium ${
                            book.stockQuantity > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {book.stockQuantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                    </div>
                    </div>

                    {/* Update Button */}
                    <div>
                    <Link
                        href={`/employee/inventory/${book.id}`}
                        className="rounded-xl bg-[#2f3e46] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Update Inventory
                    </Link>
                    </div>
                </div>
                ))}
            </div>
        </main>
    );
}