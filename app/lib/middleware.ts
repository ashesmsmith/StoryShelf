import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("session")?.value;

  let user: { role?: string } | null = null;

  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie);
    } catch {
      user = null;
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!user || user.role !== "employee") {
      return NextResponse.redirect(new URL("/employee/login", req.url));
    }
  }

  if (pathname.startsWith("/account")) {
    if (!user || user.role !== "customer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};