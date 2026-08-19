import Link from "next/link";

const opportunities = [
  {
    title: "Software Engineering Intern",
    capacity: 12,
    accepted: 8,
    pending: 3,
    rejected: 1,
  },
  {
    title: "Business Operations Intern",
    capacity: 6,
    accepted: 4,
    pending: 1,
    rejected: 1,
  },
  {
    title: "Marketing Intern",
    capacity: 6,
    accepted: 2,
    pending: 3,
    rejected: 1,
  },
];

export default function OrganisationReportsPage() {
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
        <p className="font-semibold text-orange-500">REPORTS</p>
        <h1 className="mt-2 text-3xl font-bold">Organisation performance</h1>
        <p className="mt-2 text-slate-600">
          Review opportunity capacity and allocation decisions.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Metric label="Total opportunities" value="3" color="text-orange-500" />
          <Metric label="Total positions" value="24" color="text-blue-700" />
          <Metric label="Accepted allocations" value="14" color="text-emerald-600" />
          <Metric label="Pending review" value="7" color="text-orange-500" />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Allocation progress by opportunity</h2>
            <p className="mt-2 text-sm text-slate-500">
              Accepted allocations compared with available capacity.
            </p>

            <div className="mt-8 space-y-7">
              {opportunities.map((opportunity) => {
                const percentage = Math.round(
                  (opportunity.accepted / opportunity.capacity) * 100,
                );

                return (
                  <div key={opportunity.title}>
                    <div className="flex justify-between gap-4 text-sm">
                      <p className="font-semibold">{opportunity.title}</p>
                      <p className="font-bold text-emerald-600">
                        {opportunity.accepted}/{opportunity.capacity}
                      </p>
                    </div>

                    <div className="mt-3 h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-emerald-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      {percentage}% of positions filled
                    </p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Review decisions</h2>

            <div className="mt-7 space-y-5">
              <DecisionRow
                label="Accepted allocations"
                value="14"
                total="24"
                color="bg-emerald-500"
              />
              <DecisionRow
                label="Pending review"
                value="7"
                total="24"
                color="bg-orange-500"
              />
              <DecisionRow
                label="Rejected allocations"
                value="3"
                total="24"
                color="bg-red-500"
              />
            </div>

            <Link
              href="/dashboard/organisation/candidates"
              className="mt-8 inline-block rounded-lg border border-orange-500 px-4 py-2.5 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Review candidates
            </Link>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Opportunity summary</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200 text-sm text-slate-500">
                <tr>
                  <th className="pb-4 font-semibold">Opportunity</th>
                  <th className="pb-4 font-semibold">Capacity</th>
                  <th className="pb-4 font-semibold">Accepted</th>
                  <th className="pb-4 font-semibold">Pending</th>
                  <th className="pb-4 font-semibold">Rejected</th>
                </tr>
              </thead>

              <tbody>
                {opportunities.map((opportunity) => (
                  <tr
                    key={opportunity.title}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-5 font-semibold">{opportunity.title}</td>
                    <td className="py-5 text-slate-600">{opportunity.capacity}</td>
                    <td className="py-5 font-semibold text-emerald-600">
                      {opportunity.accepted}
                    </td>
                    <td className="py-5 font-semibold text-orange-600">
                      {opportunity.pending}
                    </td>
                    <td className="py-5 font-semibold text-red-600">
                      {opportunity.rejected}
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

function DecisionRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: string;
  total: string;
  color: string;
}) {
  const percentage = (Number(value) / Number(total)) * 100;

  return (
    <div>
      <div className="flex justify-between gap-4 text-sm">
        <p className="font-semibold">{label}</p>
        <p className="font-bold">
          {value}/{total}
        </p>
      </div>

      <div className="mt-2 h-2.5 rounded-full bg-slate-100">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}