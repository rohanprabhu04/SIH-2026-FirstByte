"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

const roleContent = {
  student: {
    title: "Applicant",
    description:
      "Create an account to explore internships and track your application journey.",
    color: "bg-blue-700",
  },
  provider: {
    title: "Organisation",
    description:
      "Create an account to publish opportunities and manage candidates.",
    color: "bg-orange-500",
  },
  admin: {
    title: "Coordinator",
    description:
      "you can manage platform information and oversee allocation.",
    color: "bg-emerald-600",
  },
};

export default function RegisterPage() {
  const params = useParams<{ role: string }>();
  const role = params.role?.toLowerCase();
  const content = roleContent[role as keyof typeof roleContent];

  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Role not found</h1>
          <Link
            href="/access"
            className="mt-5 inline-block font-semibold text-blue-700"
          >
            Return to role selection
          </Link>
        </div>
      </main>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match. Please try again.");
    return;
  }

  setError("");
  setSubmitted(true);
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
            href="/access"
            className="text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            Change role
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span
            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold text-white ${content.color}`}
          >
            {content.title} Access
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900">
            Welcome to the Smart Internship Allocation Portal
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            {content.description}
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-900">What happens next?</h2>

            <ol className="mt-4 space-y-3 text-slate-600">
              <li>1. Create your account.</li>
              <li>2. Complete the details relevant to your role.</li>
              <li>3. Use the portal tools available to you.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">

          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Form received
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                The interface is ready. We will connect this form to the real
                backend authentication service later.
              </p>
            </div>
          ) : (
            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            
              <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400"
                  />
              </div>
              

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative mt-2">
                   <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-14 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400"
                   />

                   <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                    Use at least 8 characters.
              </p>
            </div>

            <div>
            <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700"
            >
                Re-enter password
            </label>

            <div className="relative mt-2">
                <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-14 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400"
                />

                <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                    showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                {showConfirmPassword ? "◉" : "◌"}
                </button>
            </div>
        </div>

            {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
            </p>
            )}

              <button
                type="submit"
                className={`w-full rounded-lg px-5 py-3 font-semibold text-white transition hover:opacity-90 ${content.color}`}
              >
                {`Create ${content.title} account`}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}