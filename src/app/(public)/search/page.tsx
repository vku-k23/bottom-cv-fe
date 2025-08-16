import { useState } from 'react'
import { JobCard } from '@/components/design/JobCard'

export default function SearchPage() {
  const [jobs] = useState(
    Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      title: 'Backend Engineer',
      company: 'Globex',
      location: 'Ho Chi Minh City',
      salary: '$1.5k - $2.5k',
      type: i % 2 ? 'Remote' : 'On-site',
      level: i % 3 === 0 ? 'Junior' : i % 3 === 1 ? 'Mid' : 'Senior',
      postedAt: `${i + 1}d ago`,
      tags: ['Java', 'Spring', 'SQL'],
    }))
  )

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:container lg:mx-auto lg:flex-row">
      <aside className="h-fit w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:w-64">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-700">
          Filters
        </h2>
        <div className="space-y-5 text-sm">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Keyword
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Backend"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              placeholder="City / Remote"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Job Type
            </label>
            <div className="space-y-1">
              {['Full-time', 'Part-time', 'Contract', 'Intern'].map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Level
            </label>
            <div className="space-y-1">
              {['Junior', 'Mid', 'Senior', 'Lead'].map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Salary Range
            </label>
            <input type="range" className="w-full" />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>$500</span>
              <span>$5000</span>
            </div>
          </div>
          <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-black">Search Jobs</h1>
            <p className="text-sm text-gray-600">
              Showing {jobs.length} results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none">
              <option>Sort: Newest</option>
              <option>Oldest</option>
              <option>Salary High</option>
              <option>Salary Low</option>
            </select>
            <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none">
              <option>Per page: 9</option>
              <option>12</option>
              <option>24</option>
            </select>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className="h-9 w-9 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
