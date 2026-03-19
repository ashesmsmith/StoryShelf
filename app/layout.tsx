// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import "./globals.css"; // si usas css global

export const metadata: Metadata = {
  title: "StoryShelf - Bookstore",
  description: "Inventory Tracking & E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f5f2] text-[#2f3e46] antialiased">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="StoryShelf logo"
              width={180}
              height={60}
              priority
            />
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <Link href="/" scroll={false}>Home</Link>
            <Link href="/#categories" className="transition hover:text-[#52796f]">
              Categories
            </Link>
            <Link href="/#featured"  className="transition hover:text-[#52796f]">
              Featured
            </Link>
            <Link href="/#about" className="transition hover:text-[#52796f]">
              About
            </Link>

          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-[#354f52] px-5 py-2.5 text-sm font-semibold text-[#354f52] transition hover:bg-[#354f52] hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#2f3e46] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create Account
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#52796f] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-[#2f3e46]">StoryShelf</p>
            <p>Inventory Tracking & E-Commerce</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/books">Books</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/employee/login">Employee Area</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}