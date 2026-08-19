"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type DashboardRole = "applicant" | "organisation" | "coordinator";

const dashboardContent = {
  applicant: {
    title: "Applicant Dashboard",
    welcome: "Welcome back, Alex",
    subtitle: "Track your internship journey and explore opportunities.",
    badge: "Applicant",
    color: "bg-blue-700",
    menu: [
      "Overview",
      "My Profile",
      "Explore Internships",
      "Applications",
      "Allocation Status",
    ],
    stats: [
      { label: "Profile completion", value: "80%", note: "Complete your profile" },
      { label: "Active applications", value: "3", note: "Across 3 organisations" },
      { label: "Allocation status", value: "In review", note: "Results will appear here" },
    ],
    sectionTitle: "Recommended internships",
    sectionText: "Opportunities selected using your profile and preferences.",
    cards: [
      {
        title: "Frontend Development Intern",
        subtitle: "TechNova Solutions · Bengaluru",
        tag: "Technology",
      },
      {
        title: "Data Analysis Intern",
        subtitle: "Insight Labs · Hyderabad",
        tag: "Analytics",
      },
      {
        title: "Operations Intern",
        subtitle: "GrowthBridge · Pune",
        tag: "Operations",
      },
    ],
    activity: [
      "Your application for Frontend Development Intern was received.",
      "Complete your profile to improve internship matching.",
      "New opportunities are available based on your preferences.",
    ],
  },

  organisation: {
    title: "Organisation Dashboard",
    welcome: "Welcome back, BrightPath Industries",
    subtitle: "Manage opportunities, candidates, and internship capacity.",
    badge: "Organisation",
    color: "bg-orange-500",
    menu: [
      "Overview",
      "My Organisation",
      "Internship Opportunities",
      "Candidates",
      "Reports",
    ],
    stats: [
      { label: "Active opportunities", value: "5", note: "Currently accepting candidates" },
      { label: "Available positions", value: "24", note: "Across all opportunities" },
      { label: "Candidate applications", value: "42", note: "Awaiting review" },
    ],
    sectionTitle: "Your active opportunities",
    sectionText: "Review and manage the internships your organisation has posted.",
    cards: [
      {
        title: "Software Engineering Intern",
        subtitle: "12 positions available · Bengaluru",
        tag: "Active",
      },
      {
        title: "Business Operations Intern",
        subtitle: "6 positions available · Mumbai",
        tag: "Active",
      },
      {
        title: "Marketing Intern",
        subtitle: "6 positions available · Remote",
        tag: "Active",
      },
    ],
    activity: [
      "12 new candidate applications were received this week.",
      "Software Engineering Intern has 12 available positions.",
      "Your organisation profile was updated successfully.",
    ],
  },

  coordinator: {
    title: "Coordinator Dashboard",
    welcome: "Welcome back, Coordinator",
    subtitle: "Monitor activity, review data, and oversee allocation.",
    badge: "Coordinator",
    color: "bg-emerald-600",
    menu: [
      "Overview",
      "Applicants",
      "Organisations",
      "Internships",
      "Allocation Runs",
      "Reports",
    ],
    stats: [
      { label: "Total applicants", value: "1,248", note: "Registered on the platform" },
      { label: "Active internships", value: "86", note: "Across 42 organisations" },
      { label: "Allocation progress", value: "72%", note: "Current allocation cycle" },
    ],
    sectionTitle: "Allocation overview",
    sectionText: "Review the current system status before running allocation.",
    cards: [
      {
        title: "Applicant data review",
        subtitle: "1,105 profiles are ready for allocation",
        tag: "Ready",
      },
      {
        title: "Internship capacity",
        subtitle: "642 positions are currently available",
        tag: "Available",
      },
      {
        title: "Current allocation run",
        subtitle: "Draft results are ready for review",
        tag: "In progress",
      },
    ],
    activity: [
      "New applicant profiles were added to the platform.",
      "Three organisations published new internship opportunities.",
      "The latest allocation run is ready for review.",
    ],
  },
};

export default function DashboardPage() {
  const params = useParams<{ role: string }>();
  const role = params.role?.toLowerCase() as DashboardRole;
  const content = dashboardContent[role];

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard not found
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block font-semibold text-blue-700"
          >
            Return to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-slate-900 p-6 text-slate-200 lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
              SI
            </div>

            <div>
              <p className="font-bold text-white">Smart Internship</p>
              <p className="text-sm text-slate-400">Allocation Portal</p>
            </div>
          </Link>

          <div className="mt-10">
            <p className="px-3 text-xs font-bold tracking-wider text-slate-500">
              MENU
            </p>

            <nav className="mt-3 space-y-2">
              {content.menu.map((item, index) => {
                const dashboardRoutes: Record<string, Record<string, string>> = {
                    applicant: {
                    Overview: "/dashboard/applicant",
                    "My Profile": "/dashboard/applicant/profile",
                    "Explore Internships": "/dashboard/applicant/internships",
                    Applications: "/dashboard/applicant/applications",
                    "Allocation Status": "/dashboard/applicant/allocation",
                    },

                    organisation: {
                    Overview: "/dashboard/organisation",
                    "My Organisation": "/dashboard/organisation/profile",
                    "Internship Opportunities":
                        "/dashboard/organisation/opportunities",
                    Candidates: "/dashboard/organisation/candidates",
                    Reports: "/dashboard/organisation/reports",
                    },

                    coordinator: {
                    Overview: "/dashboard/coordinator",
                    Applicants: "/dashboard/coordinator/applicants",
                    Organisations: "/dashboard/coordinator/organisations",
                    Internships: "/dashboard/coordinator/internships",
                    "Allocation Runs": "/dashboard/coordinator/allocation",
                    Reports: "/dashboard/coordinator/reports",
                    },
                };

                const href = dashboardRoutes[role][item] ?? `/dashboard/${role}`;

                return (
                    <Link
                    key={item}
                    href={href}
                    className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                        index === 0
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                    >
                    {item}
                    </Link>
                );
                })}
            </nav>
          </div>

          <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{content.badge}</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              You are viewing the {content.badge.toLowerCase()} portal.
            </p>

            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-semibold text-orange-300 hover:text-orange-200"
            >
              Sign out →
            </Link>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4 lg:px-10">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {content.title}
                </p>
                <h1 className="mt-1 text-xl font-bold text-slate-900">
                  {content.welcome}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`hidden rounded-full px-3 py-1.5 text-sm font-semibold text-white sm:inline-block ${content.color}`}
                >
                  {content.badge}
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700">
                  A
                </div>
              </div>
            </div>
          </header>

          <section className="px-6 py-8 lg:px-10">
            <p className="max-w-2xl text-slate-600">{content.subtitle}</p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {content.stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {content.sectionTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {content.sectionText}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${content.color}`}
                  >
                    View all
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {content.cards.map((card) => (
                    <article
                      key={card.title}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold text-white ${content.color}`}
                      >
                        {card.tag}
                      </span>
                      <h3 className="mt-4 font-bold text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {card.subtitle}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Recent activity
                </h2>

                <div className="mt-5 space-y-5">
                  {content.activity.map((item, index) => (
                    <div key={item} className="flex gap-3">
                      <div
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${content.color}`}
                      >
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}