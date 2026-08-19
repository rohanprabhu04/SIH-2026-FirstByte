"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Opportunity = {
  id: number;
  title: string;
  location: string;
  sector: string;
  capacity: number;
  applicants: number;
  status: "Active" | "Draft" | "Closed";
};

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Software Engineering Intern",
    location: "Bengaluru",
    sector: "Technology",
    capacity: 12,
    applicants: 18,
    status: "Active",
  },
  {
    id: 2,
    title: "Business Operations Intern",
    location: "Mumbai",
    sector: "Operations",
    capacity: 6,
    applicants: 9,
    status: "Active",
  },
  {
    id: 3,
    title: "Marketing Intern",
    location: "Remote",
    sector: "Marketing",
    capacity: 6,
    applicants: 4,
    status: "Draft",
  },
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const visibleOpportunities =
    selectedStatus === "All"
      ? opportunities
      : opportunities.filter((opportunity) => opportunity.status === selectedStatus);

  function createOpportunity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newOpportunity: Opportunity = {
      id: Date.now(),
      title: String(formData.get("title")),
      location: String(formData.get("location")),
      sector: String(formData.get("sector")),
      capacity: Number(formData.get("capacity")),
      applicants: 0,
      status: "Active",
    };

    setOpportunities([newOpportunity, ...opportunities]);
    setShowForm(false);
    event.currentTarget.reset();
  }

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
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-orange-500">
              INTERNSHIP OPPORTUNITIES
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Manage internship listings
            </h1>
            <p className="mt-2 text-slate-600">
              Create, review, and monitor opportunities published by your organisation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            {showForm ? "Close form" : "+ Create opportunity"}
          </button>
        </div>

        {showForm && (
          <section className="mt-8 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Create internship opportunity</h2>

            <form
              onSubmit={createOpportunity}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <FormField label="Internship title" name="title" placeholder="e.g. UI/UX Design Intern" />
              <FormField label="Location" name="location" placeholder="e.g. Bengaluru or Remote" />

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Sector
                </label>

                <select
                  name="sector"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">Select sector</option>
                  <option>Technology</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Manufacturing</option>
                </select>
              </div>

              <FormField
                label="Number of positions"
                name="capacity"
                placeholder="e.g. 10"
                type="number"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Publish opportunity
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Total opportunities" value={String(opportunities.length)} />
          <SummaryCard
            label="Active opportunities"
            value={String(
              opportunities.filter((opportunity) => opportunity.status === "Active")
                .length,
            )}
          />
          <SummaryCard
            label="Total available positions"
            value={String(
              opportunities.reduce(
                (total, opportunity) => total + opportunity.capacity,
                0,
              ),
            )}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">Your opportunities</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review current positions and applicant interest.
              </p>
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleOpportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-orange-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      opportunity.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : opportunity.status === "Draft"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {opportunity.status}
                  </span>

                  <span className="text-sm font-semibold text-slate-400">
                    {opportunity.applicants} applicants
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">{opportunity.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {opportunity.sector} · {opportunity.location}
                </p>

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    AVAILABLE POSITIONS
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {opportunity.capacity}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-lg border border-orange-500 px-4 py-2.5 font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Manage opportunity
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        required
        min={type === "number" ? 1 : undefined}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-orange-500">{value}</p>
    </article>
  );
}