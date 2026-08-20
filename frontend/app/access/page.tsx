"use client";

import Link from "next/link";
import { useState } from "react";

type Role = "Student" | "Provider" | "Admin";

const roles: {
  name: Role;
  title : string;
  label: string;
  description: string;
  details: string;
  color: string;
}[] = [
  {
    name: "Student",
    title : "Applicant",
    label: "AP",
    description: "Find internships and track your application journey.",
    details:
      "Create a profile, explore opportunities, and view your allocation result.",
    color: "border-blue-600 bg-blue-50",
  },
  {
    name: "Provider",
    title: "Organisation",
    label: "OR",
    description: "Publish internships and manage candidate opportunities.",
    details:
      "Create internship opportunities and review candidates assigned to your organisation.",
    color: "border-orange-500 bg-orange-50",
  },
  {
    name: "Admin",
    title: "Coordinator",
    label: "CO",
    description: "Manage the system and oversee the allocation process.",
    details:
      "Review data, manage internships, and run or monitor allocation results.",
    color: "border-emerald-600 bg-emerald-50",
  },
];

export default function AccessPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const selectedRoleInfo = roles.find((role) => role.name === selectedRole);

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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <p className="font-semibold text-orange-500">GET STARTED</p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose how you will use the portal
          </h1>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const isSelected = selectedRole === role.name;

            return (
              <button
                key={role.name}
                type="button"
                onClick={() => setSelectedRole(role.name)}
                className={`rounded-2xl border-2 p-7 text-left transition ${
                  isSelected
                    ? `${role.color} shadow-lg`
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl font-bold ${
                    role.name === "Student"
                      ? "bg-blue-700 text-white"
                      : role.name === "Provider"
                        ? "bg-orange-500 text-white"
                        : "bg-emerald-600 text-white"
                  }`}
                >
                  {role.label}
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  {role.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {role.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-slate-800">
                  {isSelected ? "Selected ✓" : `Choose ${role.title}`}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          {selectedRoleInfo ? (
            <>
              <p className="text-sm font-semibold text-orange-500">
                SELECTED ROLE
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Continue as {selectedRoleInfo.title}
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                {selectedRoleInfo.details}
              </p>

            <Link 
                href={`/register/${selectedRoleInfo.name.toLowerCase()}`}
                className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
                Continue        
            </Link>
            </>
          ) : (
            <p className="text-slate-600">
              Select one of the three roles above to continue.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}