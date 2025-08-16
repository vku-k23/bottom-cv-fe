'use client'
import { useState, useMemo } from 'react'
import { JobCard } from '@/components/design/JobCard'

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState(
    Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      title:
        i % 2 === 0 ? 'Senior Frontend Engineer' : 'Backend Node.js Developer',
      company: i % 3 === 0 ? 'Acme Corp' : 'Globex Ltd',
      location: i % 2 === 0 ? 'Remote' : 'Hanoi, VN',
      salary: '$2k - $3k',
      type: ['Full-time', 'Part-time', 'Contract'][i % 3],
      level: ['Junior', 'Mid', 'Senior'][i % 3],
      postedAt: `${i + 1} days ago`,
      tags: ['React', 'Typescript', 'UI/UX'].slice(0, (i % 3) + 1),
      saved: true,
    }))
  )

  const [keyword, setKeyword] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  const toggleSave = (id: number) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, saved: !j.saved } : j))
    )
  }

  const toggleType = (val: string) => {
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    )
  }
  const toggleLevel = (val: string) => {
    setSelectedLevels((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    )
  }

  const clearFilters = () => {
    setKeyword('')
    setSelectedTypes([])
    setSelectedLevels([])
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const k = keyword.trim().toLowerCase()
      const kwMatch =
        !k ||
        [j.title, j.company, j.location].some((f) =>
          f.toLowerCase().includes(k)
        )
      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(j.type)
      const levelMatch =
        selectedLevels.length === 0 || selectedLevels.includes(j.level)
      return kwMatch && typeMatch && levelMatch
    })
  }, [jobs, keyword, selectedTypes, selectedLevels])

  const jobTypes = ['Full-time', 'Part-time', 'Contract']
  const levels = ['Junior', 'Mid', 'Senior']

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      <aside className="h-fit w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:w-64">
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-700">
          Filters
        </h2>
        <div className="space-y-5 text-sm text-gray-600">
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              placeholder="Search saved"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block font-medium text-gray-700">
                Job Type
              </label>
              {selectedTypes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTypes([])}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1">
              {jobTypes.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => toggleType(t)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block font-medium text-gray-700">Level</label>
              {selectedLevels.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedLevels([])}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1">
              {levels.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(t)}
                    onChange={() => toggleLevel(t)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                /* live filtering already applied */
              }}
              className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-black">Saved Jobs</h1>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {filteredJobs.length} / {jobs.length}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {selectedTypes.length > 0 && (
              <span className="rounded bg-blue-50 px-2 py-1 text-blue-600">
                {selectedTypes.length} type{selectedTypes.length > 1 && 's'}
              </span>
            )}
            {selectedLevels.length > 0 && (
              <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-600">
                {selectedLevels.length} level{selectedLevels.length > 1 && 's'}
              </span>
            )}
            {keyword && (
              <span className="max-w-[160px] truncate rounded bg-green-50 px-2 py-1 text-green-600">
                &ldquo;{keyword}&rdquo;
              </span>
            )}
          </div>
        </div>
        {filteredJobs.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-center">
            <p className="text-sm font-medium text-gray-700">
              No saved jobs match your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onToggleSave={() => toggleSave(job.id as number)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
