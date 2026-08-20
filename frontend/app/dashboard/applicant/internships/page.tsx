"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const internships = [
  {
    id: "INT-001",
    title: "Frontend Development Intern",
    organisation: "TechNova Solutions",
    location: "Bengaluru",
    sector: "Technology",
    mode: "Hybrid",
    duration: "6 months",
    stipend: "₹12,000/month",
    skills: ["React", "JavaScript", "UI Design"],
  },
  {
    id: "INT-002",
    title: "Data Analysis Intern",
    organisation: "Insight Labs",
    location: "Hyderabad",
    sector: "Analytics",
    mode: "On-site",
    duration: "6 months",
    stipend: "₹10,000/month",
    skills: ["Excel", "Python", "SQL"],
  },
  {
    id: "INT-003",
    title: "Operations Intern",
    organisation: "GrowthBridge",
    location: "Pune",
    sector: "Operations",
    mode: "Hybrid",
    duration: "3 months",
    stipend: "₹8,000/month",
    skills: ["Communication", "Planning", "MS Office"],
  },
  {
    id: "INT-004",
    title: "Marketing Intern",
    organisation: "BrandCanvas",
    location: "Remote",
    sector: "Marketing",
    mode: "Remote",
    duration: "6 months",
    stipend: "₹9,000/month",
    skills: ["Social Media", "Content", "Research"],
  },
  {
    id: "INT-005",
    title: "Quality Assurance Intern",
    organisation: "CloudPeak Systems",
    location: "Chennai",
    sector: "Technology",
    mode: "On-site",
    duration: "6 months",
    stipend: "₹11,000/month",
    skills: ["Testing", "Attention to Detail", "Documentation"],
  },
  {
    id: "INT-006",
    title: "Finance Intern",
    organisation: "NorthStar Finance",
    location: "Mumbai",
    sector: "Finance",
    mode: "Hybrid",
    duration: "3 months",
    stipend: "₹10,000/month",
    skills: ["Accounting", "Excel", "Analysis"],
  },
];

export default function InternshipsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const filteredInternships = useMemo(() => {
    return internships.filter((internship) => {
      const searchableText =
        `${internship.title} ${internship.organisation} ${internship.sector}`.toLowerCase();

      const matchesSearch = searchableText.includes(searchText.toLowerCase());
      const matchesSector =
        selectedSector === "All" || internship.sector === selectedSector;
      const matchesLocation =
        selectedLocation === "All" || internship.location === selectedLocation;

      return matchesSearch && matchesSector && matchesLocation;
    });
  }, [searchText, selectedSector, selectedLocation]);

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
        <p className="font-semibold text-orange-500">OPPORTUNITIES</p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Explore internships</h1>
            <p className="mt-2 text-slate-600">
              Find opportunities that suit your interests and skills.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {filteredInternships.length} opportunities found
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-slate-700"
              >
                Search
              </label>

              <input
                id="search"
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Job title, organisation, or sector"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="sector"
                className="block text-sm font-semibold text-slate-700"
              >
                Sector
              </label>

              <select
                id="sector"
                value={selectedSector}
                onChange={(event) => setSelectedSector(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option>All</option>
                <option>Technology</option>
                <option>Analytics</option>
                <option>Operations</option>
                <option>Marketing</option>
                <option>Finance</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <select
                id="location"
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option>All</option>
                <option>Bengaluru</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Chennai</option>
                <option>Mumbai</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
        </section>

        {filteredInternships.length > 0 ? (
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredInternships.map((internship) => (
              <article
                key={internship.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {internship.sector}
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    {internship.id}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold">{internship.title}</h2>
                <p className="mt-2 font-medium text-slate-600">
                  {internship.organisation}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>{internship.location} · {internship.mode}</p>
                  <p>{internship.duration} · {internship.stipend}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {internship.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  View details
                </button>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold">No internships found</h2>
            <p className="mt-2 text-slate-600">
              Try changing your search or filters.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}