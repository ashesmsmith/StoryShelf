import Link from 'next/link';

export default async function EmployeeDashboardPage() {
    return (
        <section className="min-h-screen bg-[#f4f5f2] px-6 py-12 text-[#2f3e46]">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Inventory Card */}
                    <Link
                        href="/employee/dashboard/inventory"
                        className="group rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-lg transition hover:shadow-xl"
                    >
                        <h2 className="text-2xl font-semibold text-[#354f52]">Manage Inventory</h2>
                        <p className="mt-2 text-[#52796f]">
                            Add books, update stock levels, and manage listings.
                        </p>
                        <div className="mt-6 font-semibold text-[#52796f] group-hover:underline">
                            Go to Inventory →
                        </div>
                    </Link>

                    {/* Orders Card */}
                    <Link
                        href="/employee/dashboard/orders"
                        className="group rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-lg transition hover:shadow-xl"
                    >
                        <h2 className="text-2xl font-semibold text-[#354f52]">Manage Orders</h2>
                        <p className="mt-2 text-[#52796f]">View and process customer orders.</p>
                        <div className="mt-6 font-semibold text-[#52796f] group-hover:underline">
                            Go to Orders →
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
