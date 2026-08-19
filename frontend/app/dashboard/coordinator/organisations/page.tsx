"use client";

import Link from "next/link";
import { useState } from "react";

const organisations = [
  {
    id: "ORG-001",
    name: "BrightPath Industries",
    sector: "Technology",
    location: "Bengaluru",
    opportunities: 5,
    capacity: 24,
    status: "Verified",
  },
  {
    id: "ORG-002",
    name: "Insight Labs",
    sector: "Analytics",
    location: "Hyderabad",
    opportunities: 3,
    capacity: 14,
    status: "Verified",
  },
  {
    id: "ORG-003",
    name: "GrowthBridge",
    sector: "Operations",
    location: "Pune",
    opportunities: 2,
    capacity: 10,
    status: "Pending verification",
  },
  {
    id: "ORG-004",
    name: "NorthStar Finance",
    sector: "Finance",
    location: "Mumbai",
    opportunities: 4,
    capacity: 18,
    status: "Verified",
  },
];

const statusStyle: Record<string, string> = {
  Verified: "bg-emerald-50 text-emerald-700",
  "Pending verification": "bg-orange-50 text-orange-700",
  Suspended: "bg-red-50 text-red-700",
};

export default function CoordinatorOrganisationsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const visibleOrganisations = organisations.filter((organisation) => {
    const matchesStatus =
      selectedStatus === "All" || organisation.status === selectedStatus;

    const text =
      `${organisation.name} ${organisation.sector} ${organisation.location}`.toLowerCase();

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
        <p className="font-semibold text-orange-500">ORGANISATION MANAGEMENT</p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Manage organisations</h1>
            <p className="mt-2 text-slate-600">
              Review verification status, opportunities, and total capacity.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {visibleOrganisations.length} organisations shown
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Registered organisations" value="42" color="text-emerald-600" />
          <SummaryCard label="Verified organisations" value="37" color="text-blue-700" />
          <SummaryCard label="Pending verification" value="5" color="text-orange-600" />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search organisation, sector, or location"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              <option>All</option>
              <option>Verified</option>
              <option>Pending verification</option>
              <option>Suspended</option>
            </select>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="pb-4 font-semibold">Organisation</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold">Opportunities</th>
                  <th className="pb-4 font-semibold">Capacity</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleOrganisations.map((organisation) => (
                  <tr
                    key={organisation.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5">
                      <p className="font-semibold">{organisation.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {organisation.id} · {organisation.sector}
                      </p>
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {organisation.location}
                    </td>

                    <td className="py-5 font-semibold">
                      {organisation.opportunities}
                    </td>

                    <td className="py-5 font-semibold">
                      {organisation.capacity}
                    </td>

                    <td className="py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          statusStyle[organisation.status]
                        }`}
                      >
                        {organisation.status}
                      </span>
                    </td>

                    <td className="py-5">
                      <button
                        type="button"
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        Review organisation
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