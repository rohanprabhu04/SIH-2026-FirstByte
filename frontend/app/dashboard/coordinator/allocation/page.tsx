"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AllocationRun = {
  id: string;
  type: "Initial allocation" | "Re-allocation";
  createdAt: string;
  applicants: number;
  positions: number;
  status: "Completed" | "Queued" | "Running";
};

const initialRuns: AllocationRun[] = [
  {
    id: "RUN-003",
    type: "Re-allocation",
    createdAt: "18 August 2026, 11:30 AM",
    applicants: 1105,
    positions: 642,
    status: "Completed",
  },
  {
    id: "RUN-002",
    type: "Initial allocation",
    createdAt: "15 August 2026, 10:00 AM",
    applicants: 1088,
    positions: 638,
    status: "Completed",
  },
];

const reallocationRequests = [
  {
    organisation: "BrightPath Industries",
    opportunity: "Software Engineering Intern",
    reason: "The number of available positions has increased from 10 to 12.",
    submittedAt: "19 August 2026, 9:45 AM",
  },
  {
    organisation: "Insight Labs",
    opportunity: "Data Analysis Intern",
    reason: "Updated skill requirements require a fresh candidate match.",
    submittedAt: "19 August 2026, 10:20 AM",
  },
];

const statusStyle: Record<AllocationRun["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Queued: "bg-orange-50 text-orange-700",
  Running: "bg-blue-50 text-blue-700",
};

export default function AllocationRunsPage() {
  const [runs, setRuns] = useState(initialRuns);
  const [showRunForm, setShowRunForm] = useState(false);
  const [runStarted, setRunStarted] = useState(false);

  function startAllocationRun(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const runType = formData.get("runType") as AllocationRun["type"];

    const newRun: AllocationRun = {
      id: `RUN-${String(runs.length + 1).padStart(3, "0")}`,
      type: runType,
      createdAt: "Just now",
      applicants: 1105,
      positions: 642,
      status: "Queued",
    };

    setRuns([newRun, ...runs]);
    setShowRunForm(false);
    setRunStarted(true);
  }

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
        <p className="font-semibold text-orange-500">ALLOCATION RUNS</p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">Run and monitor allocation</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Review eligible data, process re-allocation requests, and start
              allocation runs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRunForm(true)}
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Start allocation run
          </button>
        </div>

        {runStarted && (
          <div className="mt-6 rounded-xl bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
            Allocation run has been queued. When the backend is connected, this
            action will call the allocation-run API and show real progress.
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Eligible applicants" value="1,105" color="text-emerald-600" />
          <Metric label="Available positions" value="642" color="text-blue-700" />
          <Metric label="Re-allocation requests" value="2" color="text-orange-600" />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Previous allocation runs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review recent runs and allocation outcomes.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold">{run.id}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyle[run.status]
                          }`}
                        >
                          {run.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {run.type}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Created: {run.createdAt}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      View results
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-500">
                        APPLICANTS INCLUDED
                      </p>
                      <p className="mt-1 text-lg font-bold">{run.applicants}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-500">
                        AVAILABLE POSITIONS
                      </p>
                      <p className="mt-1 text-lg font-bold">{run.positions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Before you run allocation</h2>

            <div className="mt-6 space-y-5">
              <ChecklistItem
                done
                title="Applicant data"
                text="1,105 applicant profiles are ready."
              />
              <ChecklistItem
                done
                title="Internship capacity"
                text="642 positions are currently available."
              />
              <ChecklistItem
                title="Re-allocation requests"
                text="2 requests should be considered in the next run."
                warning
              />
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Organisation re-allocation requests</h2>
          <p className="mt-1 text-sm text-slate-500">
            Requests submitted by organisations before the next allocation run.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {reallocationRequests.map((request) => (
              <article
                key={request.organisation}
                className="rounded-xl border border-orange-200 bg-orange-50 p-5"
              >
                <p className="font-bold">{request.organisation}</p>
                <p className="mt-1 text-sm font-medium text-orange-800">
                  {request.opportunity}
                </p>

                <p className="mt-4 text-sm leading-6 text-slate-700">
                  {request.reason}
                </p>

                <p className="mt-4 text-xs font-medium text-slate-500">
                  Submitted {request.submittedAt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>

      {showRunForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Start allocation run</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This creates a new allocation request. The real allocation engine
              will be connected through the backend later.
            </p>

            <form onSubmit={startAllocationRun} className="mt-6">
              <label className="block text-sm font-semibold text-slate-700">
                Run type
              </label>

              <select
                name="runType"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option>Initial allocation</option>
                <option>Re-allocation</option>
              </select>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                Coordinator note
              </label>

              <textarea
                placeholder="Optional note about this allocation run"
                className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRunForm(false)}
                  className="rounded-lg px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Queue allocation run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function ChecklistItem({
  title,
  text,
  done = false,
  warning = false,
}: {
  title: string;
  text: string;
  done?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          done ? "bg-emerald-600" : warning ? "bg-orange-500" : "bg-slate-400"
        }`}
      >
        {done ? "✓" : "!"}
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}