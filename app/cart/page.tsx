'use client';

import Link from 'next/link';
import { useState } from 'react';

type CartItem = {
    id: number;
    title: string;
    author: string;
    price: number;
    quantity: number;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export default function CartPage() {
    // Mock cart data (replace with localStorage later)
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            title: 'The Silent Patient',
            author: 'Alex Michaelides',
            price: 18.99,
            quantity: 1,
        },
        {
            id: 2,
            title: 'Atomic Habits',
            author: 'James Clear',
            price: 21.5,
            quantity: 2,
        },
    ]);

    const updateQuantity = (id: number, amount: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8">
                <h1 className="mt-4 text-3xl font-bold">Shopping Cart</h1>
                <p className="mt-2 text-[#52796f]">Review your selected books before checkout.</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="rounded-3xl border border-[#cad2c5] bg-white p-10 text-center shadow-sm">
                    <p className="text-lg text-[#52796f]">Your cart is empty.</p>
                    <Link
                        href="/books"
                        className="mt-6 inline-block rounded-full bg-[#2f3e46] px-6 py-3 font-semibold text-white"
                    >
                        Browse Books
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-[#2f3e46]">
                                            {item.title}
                                        </h2>
                                        <p className="text-[#52796f]">{item.author}</p>
                                        <p className="mt-2 font-semibold text-[#354f52]">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="rounded-lg border px-3 py-1"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="rounded-lg border px-3 py-1"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-semibold text-[#2f3e46]">Order Summary</h2>

                        <div className="mt-4 flex justify-between text-[#52796f]">
                            <span>Total</span>
                            <span className="font-bold text-[#354f52]">{formatPrice(total)}</span>
                        </div>

                        <Link
                            href="/checkout"
                            className="mt-6 block w-full rounded-xl bg-[#52796f] px-5 py-3 text-center font-semibold text-white hover:opacity-90"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}
