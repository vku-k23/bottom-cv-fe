'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, MapPin, Clock, DollarSign, Bookmark } from 'lucide-react'

interface JobItem {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  timeLeft: string
  isFeatured?: boolean
}

const jobs: JobItem[] = [
  {
    id: 1,
    title: 'Senior UX Designer',
    company: 'Uplab',
    location: 'Australia',
    type: 'Contract Base',
    salary: '$80K-$120K',
    timeLeft: '4 Days Remaining',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Software Engineer',
    company: 'Google',
    location: 'USA',
    type: 'Full Time',
    salary: '$100K-$150K',
    timeLeft: '2 Days Remaining',
  },
  {
    id: 3,
    title: 'Junior Graphic Designer',
    company: 'Canva',
    location: 'Canada',
    type: 'Full Time',
    salary: '$60K-$80K',
    timeLeft: '1 Week Remaining',
  },
  {
    id: 4,
    title: 'Product Designer',
    company: 'Muzo',
    location: 'United States',
    type: 'Full Time',
    salary: '$90K-$130K',
    timeLeft: '3 Days Remaining',
  },
  {
    id: 5,
    title: 'Marketing Officer',
    company: 'Meta',
    location: 'Germany',
    type: 'Internship',
    salary: '$40K-$60K',
    timeLeft: '5 Days Remaining',
  },
  {
    id: 6,
    title: 'Interaction Designer',
    company: 'Figma',
    location: 'France',
    type: 'Full Time',
    salary: '$85K-$125K',
    timeLeft: '1 Week Remaining',
  },
]

export function FeaturedJobs() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('FeaturedJobs.heading')}
          </h2>
          <Link
            href="/jobs"
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg ${
                job.isFeatured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {job.isFeatured && (
                <div className="absolute -top-2 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  Featured
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{job.timeLeft}</span>
                    </div>
                  </div>
                </div>

                <button className="ml-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  {job.type}
                </span>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
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
