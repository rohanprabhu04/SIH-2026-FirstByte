"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function ApplicantProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setSaved(true);
    setIsEditing(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard/applicant" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
              SI
            </div>
            <div>
              <p className="font-bold">Smart Internship</p>
              <p className="text-sm text-slate-500">Applicant Portal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/applicant"
            className="text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-orange-500">MY PROFILE</p>
            <h1 className="mt-2 text-3xl font-bold">Build your applicant profile</h1>
            <p className="mt-2 text-slate-600">
              Complete and accurate information helps us recommend suitable opportunities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isEditing ? saveProfile() : setIsEditing(true))}
            className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            {isEditing ? "Save profile" : "Edit profile"}
          </button>
        </div>

        {saved && (
          <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 font-medium text-emerald-700">
            Profile changes saved 
          </p>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your basic contact and identity details.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Full name" value="Alex Sharma" editable={isEditing} />
                <Field label="Email address" value="alex.sharma@example.com" editable={isEditing} type="email" />
                <Field label="Mobile number" value="+91 98765 43210" editable={isEditing} type="tel" />
                <Field label="Date of birth" value="2003-08-15" editable={isEditing} type="date" />
                <Field label="Gender" value="Prefer not to say" editable={isEditing} />
                <Field label="State" value="Karnataka" editable={isEditing} />
                <Field label="District / City" value="Bengaluru" editable={isEditing} />
                <Field label="Pincode" value="560001" editable={isEditing} />
              </div>

              <div className="mt-5">
                <Field label="Current address" value="Bengaluru, Karnataka, India" editable={isEditing} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Education and institution</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add your current or most recent educational qualification.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Institution name" value="Example Institute of Technology" editable={isEditing} />
                <Field label="Institution type" value="College / University" editable={isEditing} />
                <Field label="Qualification" value="Bachelor of Technology" editable={isEditing} />
                <Field label="Course / Branch" value="Computer Science and Engineering" editable={isEditing} />
                <Field label="Current year / Semester" value="Final year / Semester 8" editable={isEditing} />
                <Field label="Expected graduation year" value="2026" editable={isEditing} type="number" />
                <Field label="CGPA / Percentage" value="8.4 CGPA" editable={isEditing} />
                <Field label="Institution city" value="Bengaluru" editable={isEditing} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Skills and career preferences</h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  label="Skills"
                  value="React, JavaScript, TypeScript, UI Design"
                  editable={isEditing}
                />
                <Field
                  label="Preferred sectors"
                  value="Technology, Analytics"
                  editable={isEditing}
                />
                <Field
                  label="Preferred locations"
                  value="Bengaluru, Hyderabad, Remote"
                  editable={isEditing}
                />
                <Field
                  label="Preferred work mode"
                  value="Hybrid, Remote"
                  editable={isEditing}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-blue-700 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-blue-100">PROFILE COMPLETION</p>
              <p className="mt-3 text-4xl font-bold">80%</p>
              <div className="mt-4 h-2 rounded-full bg-white/20">
                <div className="h-2 w-4/5 rounded-full bg-orange-400" />
              </div>
              <p className="mt-4 text-sm leading-6 text-blue-100">
                Add documents and verify your contact details to complete your profile.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Documents</h2>

              <div className="mt-5 space-y-4">
                <DocumentRow name="Resume / CV" status="Uploaded" />
                <DocumentRow name="Identity document" status="Not uploaded" />
                <DocumentRow name="Academic certificate" status="Not uploaded" />
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-lg border border-blue-700 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Upload document
              </button>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold">Profile visibility</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your profile is visible to the allocation process after it is complete.
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-700">
                ● Ready for review
              </p>
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
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        defaultValue={value}
        disabled={!editable}
        className={`${inputClass} disabled:cursor-default disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-600`}
      />
    </div>
  );
}

function DocumentRow({ name, status }: { name: string; status: string }) {
  const uploaded = status === "Uploaded";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3">
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className={`mt-1 text-xs font-medium ${uploaded ? "text-emerald-700" : "text-slate-500"}`}>
          {uploaded ? "● Uploaded" : "○ Not uploaded"}
        </p>
      </div>
    </div>
  );
}