import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white">
              SI
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Smart Internship
              </p>
              <p className="text-sm text-slate-500">Allocation Portal</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Login / Register
          </Link>
        </div>

        <nav className="border-t border-slate-100 bg-slate-900">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-3 text-sm font-medium text-slate-100">
            <a href="#home" className="whitespace-nowrap hover:text-orange-300">
              Home
            </a>
            <a href="#about" className="whitespace-nowrap hover:text-orange-300">
              About
            </a>
            <a href="#process" className="whitespace-nowrap hover:text-orange-300">
              How It Works
            </a>
            <a href="#benefits" className="whitespace-nowrap hover:text-orange-300">
              Benefits
            </a>
            <a href="#contact" className="whitespace-nowrap hover:text-orange-300">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-blue-100">
              A simpler way to find the right opportunity
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              Connecting talent with meaningful internships.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Smart Internship Allocation helps students discover opportunities,
              providers find suitable candidates, and administrators manage the
              process in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Get Started
              </Link>

              <a
                href="#process"
                className="rounded-lg border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Smart matching
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Built for the complete internship journey
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-2xl font-bold text-blue-700">01</p>
                  <p className="mt-2 font-semibold">Discover</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Explore suitable opportunities.
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-2xl font-bold text-orange-600">02</p>
                  <p className="mt-2 font-semibold">Match</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Match skills and preferences.
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-2xl font-bold text-emerald-600">03</p>
                  <p className="mt-2 font-semibold">Grow</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Begin your career journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="mt-3 text-3xl font-bold">
            One portal for every participant
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            Our platform brings the internship process together: students can
            find relevant opportunities, providers can share openings, and
            administrators can coordinate allocation transparently.
          </p>
        </div>

        <div id="benefits" className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">FOR STUDENTS</p>
            <h3 className="mt-3 text-xl font-bold">Find your opportunity</h3>
            <p className="mt-3 leading-7 text-slate-600">
              View internships that align with your qualifications, skills, and
              preferences.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-orange-600">
              FOR PROVIDERS
            </p>
            <h3 className="mt-3 text-xl font-bold">Reach suitable talent</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Publish opportunities and manage candidates through a clear
              workflow.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">
              FOR ADMINISTRATORS
            </p>
            <h3 className="mt-3 text-xl font-bold">Manage fairly</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Monitor data, run allocation, and review results from one
              workspace.
            </p>
          </article>
        </div>
      </section>

      <section id="process" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mt-3 text-3xl font-bold">Simple from start to finish</h1>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="border-l-4 border-blue-700 pl-5">
              <p className="text-sm font-bold text-blue-700">STEP 1</p>
              <h3 className="mt-2 text-xl font-bold">Create an account</h3>
              <p className="mt-2 text-slate-600">
                Choose the role that represents you.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-5">
              <p className="text-sm font-bold text-orange-500">STEP 2</p>
              <h3 className="mt-2 text-xl font-bold">Complete your details</h3>
              <p className="mt-2 text-slate-600">
                Add the information needed for the process.
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-5">
              <p className="text-sm font-bold text-emerald-600">STEP 3</p>
              <h3 className="mt-2 text-xl font-bold">Move forward</h3>
              <p className="mt-2 text-slate-600">
                Track opportunities, candidates, and results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 py-10 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-white">Smart Internship Allocation</p>
            <p className="mt-1 text-sm">
              A platform for smarter internship management.
            </p>
          </div>

          <p className="text-sm">© 2026 Smart Internship Allocation</p>
        </div>
      </footer>
    </main>
  );
}