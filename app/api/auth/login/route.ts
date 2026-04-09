import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { lazy } from 'react';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const redirectTo =
      user.role === 'employee' ? '/employee/dashboard' : '/account';

    const response = NextResponse.json({
      message: 'Login successful',
      redirectTo,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(
      'session',
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}