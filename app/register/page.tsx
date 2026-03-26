"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to register.");
        return;
      }

      setSuccess("Employee account created successfully.");
      setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError("Unexpected error while registering.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Employee Registration
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Create your StoryShelf employee account
          </h1>
          <p className="mt-3 text-slate-600">
            Register to access the inventory dashboard.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
                placeholder="Ashley Smith"
              />
            </div>

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
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
                placeholder="Minimum 6 characters"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-700 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}