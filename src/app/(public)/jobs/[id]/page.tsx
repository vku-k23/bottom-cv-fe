import Link from 'next/link'

export default function JobDetailPage({
  params: _params,
}: {
  params: { id: string }
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Senior Frontend Engineer
          </h1>
          <div className="mt-2 text-sm text-gray-600">
            Acme Corp • Remote • Full-time
          </div>
        </div>
        <div className="flex gap-3">
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Save
          </button>
          <button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Apply Now
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-black">
              Job Description
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              We are seeking a skilled Senior Frontend Engineer to build and
              optimize high-impact user interfaces...
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-black">
              Responsibilities
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Develop scalable UI components</li>
              <li>Collaborate with design & backend teams</li>
              <li>Optimize performance and accessibility</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-black">
              Requirements
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>5+ years with React / Typescript</li>
              <li>Strong CSS & design systems understanding</li>
              <li>Experience with performance profiling</li>
            </ul>
          </section>
        </div>
        <aside className="h-fit space-y-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Overview
            </h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
                <strong className="text-gray-800">Salary:</strong> $2k - $3k
              </li>
              <li>
                <strong className="text-gray-800">Experience:</strong> 5+ Years
              </li>
              <li>
                <strong className="text-gray-800">Level:</strong> Senior
              </li>
              <li>
                <strong className="text-gray-800">Openings:</strong> 2
              </li>
              <li>
                <strong className="text-gray-800">Posted:</strong> 2 days ago
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Company
            </h3>
            <div className="text-xs text-gray-600">
              Acme Corp builds enterprise SaaS solutions powering modern
              workflows.
            </div>
            <Link
              href="/companies/1"
              className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
            >
              View Company
            </Link>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Typescript', 'UI/UX', 'Performance'].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
