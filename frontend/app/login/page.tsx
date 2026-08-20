"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Role = "Applicant" | "Organisation" | "Coordinator";

const roles: Role[] = ["Applicant", "Organisation", "Coordinator"];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("Applicant");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dashboardRoutes = {
    Applicant: "applicant",
    Organisation: "organisation",
    Coordinator: "coordinator",
  };

  router.push(`/dashboard/${dashboardRoutes[selectedRole]}`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
              SI
            </div>

            <div>
              <p className="font-bold text-slate-900">Smart Internship</p>
              <p className="text-sm text-slate-500">Allocation Portal</p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-orange-500 sm:text-6xl">
            Welcome back
          </h1>

          <p className="mt-5 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
            Sign in to continue your internship journey.
          </p>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Access your personalised portal to manage applications,
            opportunities, or platform activity.
          </p>

          <div className="mt-8 rounded-2xl bg-blue-700 p-6 text-white">
            <p className="font-semibold">New to the portal?</p>
            <p className="mt-2 text-blue-100">
              Create your account and choose the role that fits you.
            </p>

            <Link
              href="/access"
              className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Sign-in form ready
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Later, this form will verify the email and password through the
                backend, then open the correct dashboard.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 font-semibold text-blue-700 hover:text-blue-900"
              >
                Return to sign in
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="mt-2 text-slate-600">
                Choose your portal role and enter your account details.
              </p>

              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    I am signing in as
                  </label>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                          selectedRole === role
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-slate-300 bg-white text-slate-600 hover:border-blue-400"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 "
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                >
                  Sign in as {selectedRole}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}