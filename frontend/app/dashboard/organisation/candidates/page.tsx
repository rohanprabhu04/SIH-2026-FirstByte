"use client";

import Link from "next/link";
import { useState } from "react";

type ReviewStatus = "Pending review" | "Accepted" | "Rejected";

type Candidate = {
  id: string;
  name: string;
  internship: string;
  education: string;
  institution: string;
  location: string;
  matchScore: number;
  reviewStatus: ReviewStatus;
  skills: string[];
  reason: string;
  rejectionReason?: string;
};

const initialCandidates: Candidate[] = [
  {
    id: "A-101",
    name: "Aarav Mehta",
    internship: "Software Engineering Intern",
    education: "B.Tech, Computer Science",
    institution: "National Institute of Technology",
    location: "Bengaluru",
    matchScore: 92,
    reviewStatus: "Pending review",
    skills: ["React", "JavaScript", "TypeScript"],
    reason: "Strong technical skills and preferred location match.",
  },
  {
    id: "A-102",
    name: "Diya Kapoor",
    internship: "Software Engineering Intern",
    education: "B.Tech, Information Technology",
    institution: "Institute of Engineering",
    location: "Mysuru",
    matchScore: 88,
    reviewStatus: "Pending review",
    skills: ["Python", "Java", "SQL"],
    reason: "Meets eligibility requirements with a strong skill match.",
  },
  {
    id: "A-103",
    name: "Kabir Singh",
    internship: "Business Operations Intern",
    education: "BBA",
    institution: "City College",
    location: "Mumbai",
    matchScore: 84,
    reviewStatus: "Accepted",
    skills: ["Excel", "Communication", "Research"],
    reason: "Strong preference and academic compatibility.",
  },
];

const statusStyle: Record<ReviewStatus, string> = {
  "Pending review": "bg-orange-50 text-orange-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [rejectingCandidateId, setRejectingCandidateId] = useState<
    string | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reoptimisationRequested, setReoptimisationRequested] = useState(false);
  const [showReallocationDialog, setShowReallocationDialog] = useState(false);
  const [reallocationReason, setReallocationReason] = useState("");

  const visibleCandidates = candidates.filter((candidate) => {
    const matchesStatus =
      selectedStatus === "All" || candidate.reviewStatus === selectedStatus;

    const searchValue =
      `${candidate.name} ${candidate.internship} ${candidate.skills.join(" ")}`.toLowerCase();

    return matchesStatus && searchValue.includes(searchText.toLowerCase());
  });

  const pendingCount = candidates.filter(
    (candidate) => candidate.reviewStatus === "Pending review",
  ).length;

  const acceptedCount = candidates.filter(
    (candidate) => candidate.reviewStatus === "Accepted",
  ).length;

  const rejectedCount = candidates.filter(
    (candidate) => candidate.reviewStatus === "Rejected",
  ).length;

  function acceptCandidate(candidateId: string) {
    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, reviewStatus: "Accepted" }
          : candidate,
      ),
    );
  }

  function confirmRejection() {
    if (!rejectingCandidateId || !rejectionReason.trim()) {
      return;
    }

    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === rejectingCandidateId
          ? {
              ...candidate,
              reviewStatus: "Rejected",
              rejectionReason: rejectionReason.trim(),
            }
          : candidate,
      ),
    );

    setRejectingCandidateId(null);
    setRejectionReason("");
  }

  function requestReoptimisation() {
    if (!reallocationReason.trim()) {
       return;
    }

    setReoptimisationRequested(true);
    setShowReallocationDialog(false);
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
        <p className="font-semibold text-orange-500">ALLOCATION REVIEW</p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">
              Candidates recommended for your organisation
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              These candidates were recommended by the allocation engine.
              Review each proposed allocation and accept or reject it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReallocationDialog(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
           >
            Request re-allocation
          </button>
        </div>

        {reoptimisationRequested && (
          <div className="mt-6 rounded-xl bg-blue-50 px-5 py-4 text-sm font-medium text-blue-800">
            Re-optimisation requested, will be verified soon by the governing committee
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Awaiting review"
            value={String(pendingCount)}
            color="text-orange-600"
          />
          <SummaryCard
            label="Accepted allocations"
            value={String(acceptedCount)}
            color="text-emerald-600"
          />
          <SummaryCard
            label="Rejected allocations"
            value={String(rejectedCount)}
            color="text-red-600"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search candidate, internship, or skill"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option>All</option>
              <option>Pending review</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {visibleCandidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
                    {candidate.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">{candidate.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Applicant ID: {candidate.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    statusStyle[candidate.reviewStatus]
                  }`}
                >
                  {candidate.reviewStatus}
                </span>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      PROPOSED INTERNSHIP
                    </p>
                    <p className="mt-1 font-semibold">{candidate.internship}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500">
                      MATCH SCORE
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      {candidate.matchScore}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-slate-500">EDUCATION</p>
                  <p className="mt-1 text-sm font-semibold">
                    {candidate.education}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500">LOCATION</p>
                  <p className="mt-1 text-sm font-semibold">
                    {candidate.location}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                {candidate.institution}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
                <p className="text-xs font-bold text-blue-700">
                  ALLOCATION ENGINE EXPLANATION
                </p>
                <p className="mt-2 text-sm leading-6 text-blue-900">
                  {candidate.reason}
                </p>
              </div>

              {candidate.reviewStatus === "Pending review" && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => acceptCandidate(candidate.id)}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Accept allocation
                  </button>

                  <button
                    type="button"
                    onClick={() => setRejectingCandidateId(candidate.id)}
                    className="flex-1 rounded-lg border border-red-500 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              )}

              {candidate.reviewStatus === "Accepted" && (
                <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  ✓ Allocation accepted by your organisation.
                </p>
              )}

              {candidate.reviewStatus === "Rejected" && (
                <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                  <p className="font-semibold">Allocation rejected</p>
                  <p className="mt-1">
                    Reason: {candidate.rejectionReason}
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>

        {visibleCandidates.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold">No candidates found</h2>
            <p className="mt-2 text-slate-600">
              Try changing the search text or review-status filter.
            </p>
          </section>
        )}
                {showReallocationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Request re-allocation</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
                Explain why a new allocation should be run. The coordinator will use
                this information while reviewing the request.
            </p>

            <textarea
                value={reallocationReason}
                onChange={(event) => setReallocationReason(event.target.value)}
                placeholder="For example: internship capacity has changed or requirements were updated."
                className="mt-5 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <div className="mt-5 flex justify-end gap-3">
                <button
                type="button"
                onClick={() => {
                    setShowReallocationDialog(false);
                    setReallocationReason("");
                }}
                className="rounded-lg px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100"
                >
                Cancel
                </button>

                <button
                type="button"
                onClick={requestReoptimisation}
                disabled={!reallocationReason.trim()}
                className="rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                Submit request
                </button>
            </div>
            </div>
        </div>
        )}
      </section>

      {rejectingCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Reject proposed allocation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Give a reason for rejecting this candidate. The coordinator can
              use this information during re-optimisation.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter the reason for rejection"
              className="mt-5 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectingCandidateId(null);
                  setRejectionReason("");
                }}
                className="rounded-lg px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                Confirm rejection
              </button>
            </div>
          </div>
        </div>
      )}
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