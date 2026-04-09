import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateOrderStatus } from './actions';

type OrderDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const orderId = Number(id);
    if (isNaN(orderId)) return notFound();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { book: true } },
            user: true,
        },
    });

    if (!order) return notFound();

    const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-10">
                <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                    Order #{order.id}
                </span>
                <h1 className="mt-4 text-3xl font-bold text-[#2f3e46]">Order Details</h1>
            </div>

            {/* Customer / Shipping Info */}
            <section className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#2f3e46] mb-2">Customer Info</h2>
                <p className="text-[#52796f]">
                    {order.user
                        ? `${order.user.firstName} ${order.user.lastName} (${order.user.email})`
                        : 'Guest'}
                </p>
                <h2 className="text-xl font-semibold text-[#2f3e46] mt-4 mb-2">Shipping Address</h2>
                <p className="text-[#52796f]">
                    {order.shippingFirstName} {order.shippingLastName}
                    <br />
                    {order.shippingStreet}
                    <br />
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                    <br />
                    {order.shippingCountry}
                </p>
            </section>

            {/* Order Items */}
            <section className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#2f3e46] mb-4">Order Items</h2>
                <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between py-2">
                            <span>
                                {item.book.title} x {item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 text-right font-semibold text-[#2f3e46]">
                    Total: ${total.toFixed(2)}
                </p>
            </section>

            {/* Update Status */}
            <section className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#2f3e46] mb-4">Update Order</h2>
                <form action={updateOrderStatus} className="flex flex-col gap-4 max-w-sm">
                    <input type="hidden" name="id" value={order.id} />

                    <label className="font-medium text-[#2f3e46]">Order Status</label>
                    <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <label className="font-medium text-[#2f3e46]">Payment Status</label>
                    <select
                        name="paymentStatus"
                        defaultValue={order.paymentStatus}
                        className="rounded-xl border border-[#cad2c5] px-4 py-3"
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                    </select>

                    <button className="rounded-xl bg-[#2f3e46] px-6 py-3 text-white">
                        Save Changes
                    </button>
                </form>
            </section>

            <Link href="/employee/dashboard/orders" className="text-[#52796f] underline">
                ← Back to Orders
            </Link>
        </main>
    );
}