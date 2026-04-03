'use client';

import { useEffect, useState } from 'react';
import BookImage from '@/components/BookImage';

type CartItem = {
    id: number;
    quantity: number;
    book: {
        id: number;
        title: string;
        author: string;
        price: number;
        imageURL?: string;
    } | null;
};

type CheckoutForm = {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CheckoutForm>({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });
    const [placingOrder, setPlacingOrder] = useState(false);
    const [success] = useState(false);

    const hasInvalidItems = cartItems.some((item) => !item.book);
    const isFormIncomplete = Object.values(form).some((v) => !v.trim());

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load cart');

            setCartItems(data.items);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Failed to load cart');
        } finally {
            setLoadingCart(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        if (hasInvalidItems || cartItems.length === 0 || isFormIncomplete) return;
        if (placingOrder) return;

        setPlacingOrder(true);
        setError(null);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to place order');

            const url: string = data.url;
            window.location.href = url;
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Failed to place order');
        } finally {
            setPlacingOrder(false);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

    if (loadingCart) return <p className="p-6">Loading cart...</p>;
    if (success)
        return (
            <div className="max-w-xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p>Thank you for your purchase.</p>
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">{error}</div>}

            {hasInvalidItems && (
                <p className="text-red-500 mt-2">
                    Some items in your cart are no longer available. Please remove them before
                    placing your order.
                </p>
            )}

            {/* Cart Items Summary */}
            <div className="space-y-4">
                {cartItems.length === 0 && <p>Your cart is empty.</p>}

                {cartItems.map((item) => {
                    if (!item.book)
                        return (
                            <div key={item.id} className="border p-4 rounded-xl bg-red-50">
                                <p className="text-red-600">This book is no longer available.</p>
                            </div>
                        );

                    return (
                        <div key={item.id} className="flex gap-4 border p-4 rounded-xl">
                            <BookImage
                                src={item.book.imageURL}
                                alt={item.book.title}
                                className="object-cover w-24 h-32 rounded"
                            />
                            <div className="flex-1">
                                <h2 className="font-semibold">{item.book.title}</h2>
                                <p>{item.book.author}</p>
                                <p>{formatPrice(item.book.price)}</p>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total */}
            <div className="border p-4 rounded-xl">
                <h2 className="font-semibold text-lg">Total: {formatPrice(total)}</h2>
            </div>

            {/* Shipping Form */}
            <div className="space-y-4 border p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                {Object.entries(form).map(([key, value]) => (
                    <div key={key}>
                        <label className="block mb-1 capitalize">{key}</label>
                        <input
                            name={key}
                            value={value}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                ))}

                <button
                    disabled={
                        placingOrder ||
                        hasInvalidItems ||
                        cartItems.length === 0 ||
                        isFormIncomplete
                    }
                    onClick={placeOrder}
                    className="mt-4 w-full bg-black text-white py-2 rounded disabled:opacity-50"
                >
                    {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
}
