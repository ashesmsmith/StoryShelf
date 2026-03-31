import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = (await cookies()).get('session')?.value;

    if (!session) {
        redirect('/login');
    }

    let user;

    try {
        user = JSON.parse(session);
    } catch {
        redirect('/login');
    }

    if (user.role !== 'employee') {
        redirect('/login');
    }

    return (
        <section className="min-h-screen bg-slate-50 px-6 py-12">
            <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Inventory Dashboard
                </p>
                <h1 className="mt-3 text-4xl font-bold text-slate-900">Welcome, {user.name}</h1>
                <p className="mt-3 text-slate-600">
                    You are logged in as an employee and can access the inventory area.
                </p>
            </div>
        </section>
    );
}
