'use client';

import { useState } from 'react';

export default function CheckoutPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: connect to /api/orders
        console.log('Order submitted:', form);

        alert('Order placed successfully!');
    };

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8">
                <h1 className="mt-4 text-3xl font-bold">Complete Your Order</h1>
                <p className="mt-2 text-[#52796f]">Enter your details to finalize your purchase.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-[#2f3e46]">Customer Information</h2>

                    <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                        />

                        <textarea
                            placeholder="Shipping Address"
                            required
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none focus:border-[#52796f]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-xl bg-[#2f3e46] px-5 py-3 font-semibold text-white hover:opacity-90"
                    >
                        Place Order
                    </button>
                </form>

                {/* Summary Placeholder */}
                <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-[#2f3e46]">Order Summary</h2>

                    <p className="mt-4 text-[#52796f]">
                        Cart summary will appear here (connect from cart or backend).
                    </p>

                    <div className="mt-6 border-t pt-4 flex justify-between">
                        <span className="font-medium text-[#52796f]">Total</span>
                        <span className="font-bold text-[#354f52]">$0.00</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
