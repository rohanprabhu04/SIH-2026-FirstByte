"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function OrganisationProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard/organisation"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-bold text-white">
              SI
            </div>

            <div>
              <p className="font-bold">Smart Internship</p>
              <p className="text-sm text-slate-500">Organisation Portal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/organisation"
            className="text-sm font-semibold text-slate-600 hover:text-orange-600"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-orange-500">MY ORGANISATION</p>
            <h1 className="mt-2 text-3xl font-bold">
              Organisation profile
            </h1>
            <p className="mt-2 text-slate-600">
              Keep these details updated for applicants and coordinators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            {isEditing ? "Save changes" : "Edit profile"}
          </button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Organisation details</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  label="Organisation name"
                  value="BrightPath Industries"
                  editable={isEditing}
                />
                <Field
                  label="Organisation type"
                  value="Private Limited Company"
                  editable={isEditing}
                />
                <Field
                  label="Industry sector"
                  value="Technology"
                  editable={isEditing}
                />
                <Field
                  label="Registration number"
                  value="CIN-U12345KA2020PTC000001"
                  editable={isEditing}
                />
                <Field
                  label="Official email"
                  value="contact@brightpath.example"
                  editable={isEditing}
                  type="email"
                />
                <Field
                  label="Contact number"
                  value="+91 80 1234 5678"
                  editable={isEditing}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Organisation address"
                  value="MG Road, Bengaluru, Karnataka, India"
                  editable={isEditing}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Primary contact person</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  label="Full name"
                  value="Priya Nair"
                  editable={isEditing}
                />
                <Field
                  label="Designation"
                  value="HR Manager"
                  editable={isEditing}
                />
                <Field
                  label="Email address"
                  value="priya.nair@brightpath.example"
                  editable={isEditing}
                  type="email"
                />
                <Field
                  label="Mobile number"
                  value="+91 98765 43210"
                  editable={isEditing}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">About the organisation</h2>

              <textarea
                disabled={!isEditing}
                defaultValue="BrightPath Industries is a technology-focused organisation that provides internship opportunities in software development, business operations, and data analysis."
                className={`${inputClass} min-h-32 disabled:cursor-default disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600`}
              />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-orange-500 p-6 text-white">
              <p className="text-sm font-semibold text-orange-100">
                ORGANISATION STATUS
              </p>
              <p className="mt-3 text-2xl font-bold">Verified</p>
              <p className="mt-3 text-sm leading-6 text-orange-100">
                Your organisation is eligible to publish internship opportunities.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold">Profile checklist</h2>

              <div className="mt-5 space-y-3 text-sm">
                <p className="font-medium text-emerald-700">✓ Organisation details complete</p>
                <p className="font-medium text-emerald-700">✓ Contact person added</p>
                <p className="font-medium text-emerald-700">✓ Verification complete</p>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  editable,
  type = "text",
}: {
  label: string;
  value: string;
  editable: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        defaultValue={value}
        disabled={!editable}
        className={`${inputClass} disabled:cursor-default disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600`}
      />
    </div>
  );
}