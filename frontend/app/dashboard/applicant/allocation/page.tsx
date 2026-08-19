import Link from "next/link";

export default function AllocationPage() {
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
        <p className="font-semibold text-orange-500">ALLOCATION STATUS</p>

        <h1 className="mt-2 text-3xl font-bold">
          Your internship allocation
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Track your current allocation status and understand what happens next.
        </p>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
                  In review
                </span>

                <h2 className="mt-5 text-2xl font-bold">
                  Your allocation is being processed
                </h2>

                <p className="mt-3 max-w-xl leading-7 text-slate-600">
                  Your profile, preferences, eligibility, and available
                  internship positions are being considered in the current
                  allocation cycle.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-700">
                ⏳
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Allocation progress</span>
                <span className="text-orange-600">72%</span>
              </div>

              <div className="mt-3 h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[72%] rounded-full bg-orange-500" />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <ProgressStep
                number="1"
                title="Profile reviewed"
                status="Complete"
                complete
              />
              <ProgressStep
                number="2"
                title="Eligibility checked"
                status="Complete"
                complete
              />
              <ProgressStep
                number="3"
                title="Allocation result"
                status="In progress"
              />
            </div>
          </article>

          <aside className="rounded-2xl bg-blue-700 p-7 text-white shadow-sm">
            <p className="text-sm font-semibold text-blue-100">
              IMPORTANT
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              What should you do now?
            </h2>

            <ul className="mt-5 space-y-4 text-sm leading-6 text-blue-100">
              <li>• Keep your profile and documents up to date.</li>
              <li>• Check your application status regularly.</li>
              <li>• Wait for the allocation result announcement.</li>
            </ul>

            <Link
              href="/dashboard/applicant/profile"
              className="mt-7 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Review my profile
            </Link>
          </aside>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold">How allocation works</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <AllocationRule
              number="01"
              title="Profile information"
              text="Your qualification, skills, and preferences are considered."
            />
            <AllocationRule
              number="02"
              title="Eligibility"
              text="You are checked against internship requirements."
            />
            <AllocationRule
              number="03"
              title="Suitability"
              text="Compatible opportunities receive stronger match scores."
            />
            <AllocationRule
              number="04"
              title="Available capacity"
              text="Final allocation depends on available positions."
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-7">
          <h2 className="text-xl font-bold">Allocation result</h2>
          <p className="mt-2 text-slate-600">
            Your final internship allocation will appear here once the current
            allocation run is complete.
          </p>

          <div className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            No final allocation result is available yet.
          </div>
        </section>
      </section>
    </main>
  );
}

function ProgressStep({
  number,
  title,
  status,
  complete = false,
}: {
  number: string;
  title: string;
  status: string;
  complete?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            complete
              ? "bg-emerald-600 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          {complete ? "✓" : number}
        </span>

        <span
          className={`text-xs font-bold ${
            complete ? "text-emerald-700" : "text-orange-600"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-4 font-semibold">{title}</p>
    </div>
  );
}

function AllocationRule({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="font-bold text-orange-500">{number}</p>
      <h3 className="mt-2 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}