import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const users = await prisma.user.findMany();

    return (
        <div>
        <h1>Dashboard</h1>
        <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    );
}