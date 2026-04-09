import { requireEmployee } from '@/lib/utils/requireEmployee';
import Link from 'next/link';

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
                    
                    <Link
                        href="/employee/dashboard"
                        className="rounded-lg border border-[#cad2c5] px-4 py-2 text-sm font-medium text-[#2f3e46] hover:bg-[#f0f4f3]"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </div>
    );
}