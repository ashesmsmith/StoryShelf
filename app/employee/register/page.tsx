"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function EmployeeRegisterPage() {
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
      const res = await fetch("/api/auth/employee/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      setSuccess("Employee account created successfully.");
      setTimeout(() => {
        router.push("/employee/login");
      }, 1000);
    } catch {
      setError("Unexpected error while creating account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f4f5f2] px-6 py-12 text-[#2f3e46]">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
            Employee Registration
          </span>
          <h1 className="mt-4 text-4xl font-bold">Create Employee Account</h1>
          <p className="mt-2 text-[#52796f]">
            Register an employee account for bookstore inventory access.
          </p>
        </div>

        <div className="rounded-3xl border border-[#cad2c5] bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#354f52]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
                placeholder="Employee full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#354f52]">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
                placeholder="employee@storyshelf.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#354f52]">
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
                className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
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
              className="w-full rounded-xl bg-[#2f3e46] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#52796f]">
            Already have an employee account?{" "}
            <Link
              href="/employee/login"
              className="font-semibold text-[#354f52] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}