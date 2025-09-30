const companies = [
  'Dribbble',
  'Uplabs',
  'Upwork',
  'Slack',
  'Freepik',
  'Behance',
]

export function TopCompanies() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-xl font-semibold text-gray-900 md:text-2xl">
          Top companies
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((c, i) => (
            <div
              key={c + i}
              className={`flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center text-xs shadow-sm transition hover:border-blue-500 ${
                c === 'Slack' ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                {c.charAt(0)}
              </div>
              <p className="font-medium text-gray-900">{c}</p>
              <p className="mt-1 text-[10px] text-gray-400">Open Position</p>
              <button className="mt-3 w-full rounded-md border border-blue-600 bg-white px-2 py-1 text-[10px] font-medium text-blue-600 hover:bg-blue-600 hover:text-white">
                Open Position
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
