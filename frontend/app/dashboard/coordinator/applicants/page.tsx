"use client";

import Link from "next/link";
import { useState } from "react";

const applicants = [
  {
    id: "A-101",
    name: "Aarav Mehta",
    email: "aarav@example.com",
    institution: "National Institute of Technology",
    qualification: "B.Tech, Computer Science",
    location: "Bengaluru",
    profileCompletion: 100,
    eligibility: "Ready",
  },
  {
    id: "A-102",
    name: "Diya Kapoor",
    email: "diya@example.com",
    institution: "Institute of Engineering",
    qualification: "B.Tech, Information Technology",
    location: "Mysuru",
    profileCompletion: 92,
    eligibility: "Ready",
  },
  {
    id: "A-103",
    name: "Kabir Singh",
    email: "kabir@example.com",
    institution: "City College",
    qualification: "BBA",
    location: "Mumbai",
    profileCompletion: 76,
    eligibility: "Incomplete",
  },
  {
    id: "A-104",
    name: "Ananya Rao",
    email: "ananya@example.com",
    institution: "State University",
    qualification: "BBA, Marketing",
    location: "Hyderabad",
    profileCompletion: 100,
    eligibility: "Ready",
  },
];

const eligibilityStyle: Record<string, string> = {
  Ready: "bg-emerald-50 text-emerald-700",
  Incomplete: "bg-orange-50 text-orange-700",
  Flagged: "bg-red-50 text-red-700",
};

export default function CoordinatorApplicantsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const visibleApplicants = applicants.filter((applicant) => {
    const matchesStatus =
      selectedStatus === "All" || applicant.eligibility === selectedStatus;

    const text =
      `${applicant.name} ${applicant.institution} ${applicant.location}`.toLowerCase();

    return matchesStatus && text.includes(searchText.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard/coordinator"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
              SI
            </div>

            <div>
              <p className="font-bold">Smart Internship</p>
              <p className="text-sm text-slate-500">Coordinator Portal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/coordinator"
            className="text-sm font-semibold text-slate-600 hover:text-emerald-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-semibold text-orange-500">APPLICANT MANAGEMENT</p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Review applicant profiles</h1>
            <p className="mt-2 text-slate-600">
              Check profile completeness and allocation eligibility.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {visibleApplicants.length} applicants shown
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total applicants" value="1,248" color="text-emerald-600" />
          <SummaryCard label="Ready for allocation" value="1,105" color="text-blue-700" />
          <SummaryCard label="Incomplete profiles" value="143" color="text-orange-600" />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search name, institution, or location"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option>All</option>
              <option>Ready</option>
              <option>Incomplete</option>
              <option>Flagged</option>
            </select>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="pb-4 font-semibold">Applicant</th>
                  <th className="pb-4 font-semibold">Institution</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold">Profile</th>
                  <th className="pb-4 font-semibold">Eligibility</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5">
                      <p className="font-semibold">{applicant.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {applicant.id} · {applicant.email}
                      </p>
                    </td>

                    <td className="py-5">
                      <p className="text-sm font-medium">{applicant.institution}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {applicant.qualification}
                      </p>
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {applicant.location}
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${
                              applicant.profileCompletion === 100
                                ? "bg-emerald-500"
                                : "bg-orange-500"
                            }`}
                            style={{ width: `${applicant.profileCompletion}%` }}
                          />
                        </div>

                        <span className="text-sm font-semibold">
                          {applicant.profileCompletion}%
                        </span>
                      </div>
                    </td>

                    <td className="py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          eligibilityStyle[applicant.eligibility]
                        }`}
                      >
                        {applicant.eligibility}
                      </span>
                    </td>

                    <td className="py-5">
                      <button
                        type="button"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        View profile
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