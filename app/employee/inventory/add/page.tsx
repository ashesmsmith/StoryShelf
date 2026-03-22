import { createBook } from "./actions";

export default function AddBookPage() {
    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
            <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
            Add New Book
            </span>

            <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">
            Add to Inventory
            </h1>

            <p className="mt-2 text-[#52796f]">
            Search or manually enter book details
            </p>
        </div>

        {/* Google Search (Phase 1 simple UI) */}
        <form
            action="/employee/inventory/add"
            method="GET"
            className="mb-8 flex gap-3"
        >
            <input
            name="query"
            placeholder="Search by title or ISBN"
            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3"
            />
            <button className="rounded-xl bg-[#52796f] px-5 py-3 text-white">
            Search
            </button>
        </form>

        {/* Form */}
        <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-sm">
            <form action={createBook} className="flex flex-col gap-6">
            <input
                name="title"
                placeholder="Title"
                className="rounded-xl border border-[#cad2c5] px-4 py-3"
            />

            <input
                name="author"
                placeholder="Author"
                className="rounded-xl border border-[#cad2c5] px-4 py-3"
            />

            <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                className="rounded-xl border border-[#cad2c5] px-4 py-3"
            />

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