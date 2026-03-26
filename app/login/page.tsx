"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to login.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unexpected error while logging in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Employee Access
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Sign in to StoryShelf
          </h1>
          <p className="mt-3 text-slate-600">
            Access the inventory dashboard and manage bookstore stock.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
                placeholder="employee@storyshelf.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Need an employee account?{" "}
            <Link href="/register" className="font-semibold text-amber-700 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}