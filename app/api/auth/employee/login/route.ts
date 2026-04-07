import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const valid = await comparePassword(password, user.password);

        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (user.role !== 'employee') {
            return NextResponse.json(
                { error: 'This login is for employees only' },
                { status: 403 }
            );
        }

        const response = NextResponse.json({
            message: 'Login successful',
            redirectTo: '/dashboard',
        });

        response.cookies.set(
            'session',
            JSON.stringify({
                id: user.id,
                name: user.firstName,
                email: user.email,
                role: user.role,
            }),
            {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24,
            }
        );

        return response;
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
