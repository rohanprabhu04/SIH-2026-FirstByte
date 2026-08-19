"use client";

import Link from "next/link";
import { useState } from "react";

const applications = [
  {
    id: "APP-001",
    internship: "Frontend Development Intern",
    organisation: "TechNova Solutions",
    location: "Bengaluru",
    appliedOn: "12 August 2026",
    status: "Under review",
  },
  {
    id: "APP-002",
    internship: "Data Analysis Intern",
    organisation: "Insight Labs",
    location: "Hyderabad",
    appliedOn: "10 August 2026",
    status: "Shortlisted",
  },
  {
    id: "APP-003",
    internship: "Operations Intern",
    organisation: "GrowthBridge",
    location: "Pune",
    appliedOn: "08 August 2026",
    status: "Submitted",
  },
];

const statusStyle: Record<string, string> = {
  Submitted: "bg-blue-50 text-blue-700",
  "Under review": "bg-orange-50 text-orange-700",
  Shortlisted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function ApplicationsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredApplications =
    selectedStatus === "All"
      ? applications
      : applications.filter(
          (application) => application.status === selectedStatus,
        );

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
        <p className="font-semibold text-orange-500">MY APPLICATIONS</p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Track your applications</h1>
            <p className="mt-2 text-slate-600">
              Review the current status of each internship application.
            </p>
          </div>

          <Link
            href="/dashboard/applicant/internships"
            className="rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
          >
            Explore internships
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total applications" value="3" color="text-blue-700" />
          <SummaryCard label="Under review" value="1" color="text-orange-600" />
          <SummaryCard label="Shortlisted" value="1" color="text-emerald-600" />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">Application history</h2>
              <p className="mt-1 text-sm text-slate-500">
                Status updates will appear here.
              </p>
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option>All</option>
              <option>Submitted</option>
              <option>Under review</option>
              <option>Shortlisted</option>
            </select>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="pb-4 font-semibold">Internship</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold">Applied on</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5">
                      <p className="font-semibold">{application.internship}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {application.organisation} · {application.id}
                      </p>
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {application.location}
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {application.appliedOn}
                    </td>

                    <td className="py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          statusStyle[application.status]
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td className="py-5">
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
    </article>
  );
}