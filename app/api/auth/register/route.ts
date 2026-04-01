import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';

export async function POST(req: Request) {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
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
            firstName,
            lastName,
            email,
            password: hashed,
            role: 'employee',
        },
    });

    return NextResponse.json({ message: 'User created', user });
}
