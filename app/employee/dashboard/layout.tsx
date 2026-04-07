import { requireEmployee } from '@/lib/utils/requireEmployee';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await requireEmployee();

    return (
        <div className="min-h-screen bg-[#f4f5f2]">
            {/* Header */}
            <header className="border-b border-[#cad2c5] bg-white px-6 py-4">
                <div className="mx-auto max-w-7xl flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-[#2f3e46]">
                        {user ? `Hello ${user.firstName}!` : 'Employee Dashboard'}
                    </h1>
                </div>
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
    );
}
