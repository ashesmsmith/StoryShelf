import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { name, lastName, email, password } = await req.json();

        if (!name || !email || !password || !lastName) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                firstName: name,
                lastName,
                email,
                password: hashed,
                role: 'customer',
            },
        });

        return NextResponse.json({ message: 'Customer account created', user }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
