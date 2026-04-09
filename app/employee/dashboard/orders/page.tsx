import prisma from '@/lib/prisma';
import Link from 'next/link';

type OrderWithUser = {
    id: number;
    customer: { firstName: string; lastName: string; email: string };
    status: string;
    paymentStatus: string;
    createdAt: Date;
};

export default async function OrdersPage({ searchParams }: { searchParams?: { updated?: string } }) {
    const ordersRaw = await prisma.order.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });

    const orders: OrderWithUser[] = ordersRaw.map((o) => ({
        id: o.id,
        customer:  o.user 
            ? {
                firstName: o.user.firstName,
                lastName: o.user.lastName,
                email: o.user.email,
            }
            : { firstName: 'Guest', lastName: '', email: '' },
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
    }));

    const resolvedSearchParams = searchParams ? await searchParams : {};
    const updateSuccess = resolvedSearchParams?.updated === 'true';

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            {updateSuccess && (
                <div className="mb-6 rounded-lg bg-green-100 p-4 text-sm text-green-800">
                    Order updated successfully!
                </div>
            )}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-[#2f3e46]">Order Management</h1>
                <p className="mt-2 text-[#52796f]">View and manage customer orders.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#cad2c5] bg-white shadow-sm">
                <table className="w-full min-w-max divide-y divide-gray-200">
                    <thead className="bg-[#f0f4f3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[#2f3e46]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">
                                    {order.customer.firstName} {order.customer.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">
                                    {order.customer.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">{order.status}</td>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">
                                    {order.paymentStatus}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#2f3e46]">
                                    {order.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#52796f]">
                                    <Link
                                        href={`/employee/dashboard/orders/${order.id}`}
                                        className="underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}