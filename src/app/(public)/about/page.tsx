'use client'

export default function AboutPage() {
  const values = [
    { title: 'Transparency', desc: 'We communicate openly and build trust.' },
    { title: 'Velocity', desc: 'We ship fast, learn, and iterate.' },
    { title: 'Empathy', desc: 'We design for real people, not metrics.' },
    { title: 'Ownership', desc: 'Everyone is accountable for outcomes.' },
  ]
  const timeline = [
    { year: '2023', text: 'Idea conception & prototype' },
    { year: '2024', text: 'Seed funding & first 10k users' },
    { year: '2025', text: 'Expansion to APAC & AI features' },
  ]
  const team = Array.from({ length: 6 }).map((_, i) => ({
    name: 'Member ' + (i + 1),
    role: i % 2 ? 'Engineer' : 'Designer',
  }))
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-black">About Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          We are building the operating system for modern careers—matching
          talent with meaningful work.
        </p>
      </div>
      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <h2 className="text-xl font-semibold text-black">Our Mission</h2>
          <p>
            Empower professionals globally to discover, evaluate, and secure
            roles that accelerate their growth.
          </p>
          <p>
            We combine data, community, and intelligent tooling to reduce
            friction across the job search journey.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            Core Values
          </h3>
          <ul className="space-y-3 text-sm">
            {values.map((v) => (
              <li key={v.title} className="flex gap-3">
                <span className="mt-0.5 text-blue-600">◆</span>
                <div>
                  <p className="font-medium text-gray-900">{v.title}</p>
                  <p className="text-gray-600">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="mb-6 text-xl font-semibold text-black">Our Journey</h2>
        <ol className="relative ml-2 border-l border-gray-200 pl-6">
          {timeline.map((t) => (
            <li key={t.year} className="mb-8 last:mb-0">
              <div className="absolute -left-2.5 h-5 w-5 rounded-full border-2 border-blue-600 bg-white" />
              <time className="text-xs font-medium tracking-wide text-blue-600 uppercase">
                {t.year}
              </time>
              <p className="mt-1 text-sm text-gray-700">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-20">
        <h2 className="mb-8 text-xl font-semibold text-black">Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                {m.name.slice(0, 2)}
              </div>
              <p className="font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
