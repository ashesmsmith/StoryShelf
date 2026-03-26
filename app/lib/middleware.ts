import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/register"];

  const sessionCookie = req.cookies.get("session")?.value;

  let user = null;

  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie);
    } catch {
      user = null;
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (user.role !== "employee") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (authRoutes.includes(pathname) && user?.role === "employee") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};