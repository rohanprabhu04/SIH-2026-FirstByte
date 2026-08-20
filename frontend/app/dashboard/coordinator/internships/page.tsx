"use client";

import Link from "next/link";
import { useState } from "react";

const internships = [
  {
    id: "INT-001",
    title: "Software Engineering Intern",
    organisation: "BrightPath Industries",
    location: "Bengaluru",
    sector: "Technology",
    capacity: 12,
    allocated: 8,
    status: "Active",
  },
  {
    id: "INT-002",
    title: "Data Analysis Intern",
    organisation: "Insight Labs",
    location: "Hyderabad",
    sector: "Analytics",
    capacity: 10,
    allocated: 7,
    status: "Active",
  },
  {
    id: "INT-003",
    title: "Business Operations Intern",
    organisation: "GrowthBridge",
    location: "Pune",
    sector: "Operations",
    capacity: 6,
    allocated: 4,
    status: "Active",
  },
  {
    id: "INT-004",
    title: "Marketing Intern",
    organisation: "BrandCanvas",
    location: "Remote",
    sector: "Marketing",
    capacity: 8,
    allocated: 0,
    status: "Draft",
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-orange-50 text-orange-700",
  Closed: "bg-slate-100 text-slate-600",
};

export default function CoordinatorInternshipsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const visibleInternships = internships.filter((internship) => {
    const matchesStatus =
      selectedStatus === "All" || internship.status === selectedStatus;

    const text =
      `${internship.title} ${internship.organisation} ${internship.sector}`.toLowerCase();

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
        <p className="font-semibold text-orange-500">INTERNSHIP MANAGEMENT</p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Manage internship opportunities</h1>
            <p className="mt-2 text-slate-600">
              Review opportunities and capacity before running allocation.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {visibleInternships.length} internships shown
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Active internships" value="86" color="text-emerald-600" />
          <Metric label="Total positions" value="642" color="text-blue-700" />
          <Metric label="Available positions" value="218" color="text-orange-600" />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search internship, organisation, or sector"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="pb-4 font-semibold">Internship</th>
                  <th className="pb-4 font-semibold">Organisation</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold">Capacity</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleInternships.map((internship) => (
                  <tr
                    key={internship.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5">
                      <p className="font-semibold">{internship.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {internship.id} · {internship.sector}
                      </p>
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {internship.organisation}
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {internship.location}
                    </td>

                    <td className="py-5">
                      <p className="font-semibold">
                        {internship.allocated}/{internship.capacity}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {internship.capacity - internship.allocated} available
                      </p>
                    </td>

                    <td className="py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          statusStyle[internship.status]
                        }`}
                      >
                        {internship.status}
                      </span>
                    </td>

                    <td className="py-5">
                      <button
                        type="button"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        Review internship
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

function Metric({
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