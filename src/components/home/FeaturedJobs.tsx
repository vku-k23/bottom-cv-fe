import React from 'react'

interface JobItem {
  id: number
  title: string
  company: string
  location: string
  type: string
  isFeatured?: boolean
}

const jobs: JobItem[] = [
  {
    id: 1,
    title: 'Senior UX Designer',
    company: 'Uplab',
    location: 'Australia',
    type: 'Contract Base',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'Google',
    location: 'USA',
    type: 'Full Time',
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    company: 'Canva',
    location: 'Canada',
    type: 'Full Time',
  },
  {
    id: 4,
    title: 'Product Designer',
    company: 'Muzo',
    location: 'United States',
    type: 'Full Time',
  },
  {
    id: 5,
    title: 'Marketing Officer',
    company: 'Meta',
    location: 'Germany',
    type: 'Internship',
  },
  {
    id: 6,
    title: 'Interaction Designer',
    company: 'Figma',
    location: 'France',
    type: 'Full Time',
  },
]

export function FeaturedJobs() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Featured job
          </h2>
          <button className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`flex flex-col justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm transition hover:border-blue-500 md:flex-row md:items-center ${
                job.isFeatured ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <div className="flex flex-1 items-start gap-4">
                <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white md:flex">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                    <span>{job.company}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{job.location}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>$80K-$120K</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>4 Days Remaining</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600">
                  {job.type}
                </span>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
