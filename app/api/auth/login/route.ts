import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { comparePassword } from "@/app/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({
    message: "Login successful",
  });

  response.cookies.set("session", JSON.stringify({
    id: user.id,
    role: user.role,
    name: user.name
  }));

  return response;
}