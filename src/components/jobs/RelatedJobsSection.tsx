'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { JobCard, JobCardProps } from './JobCard'

interface RelatedJobsSectionProps {
  jobs: JobCardProps[]
}

export function RelatedJobsSection({ jobs }: RelatedJobsSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-4xl font-medium text-gray-900">
            {t('JobDetail.relatedJobs') || 'Related Jobs'}
          </h2>
          <button className="flex items-center gap-4 text-gray-400 hover:text-gray-600">
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {jobs.slice(0, 2).map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="space-y-6">
            {jobs.slice(2, 4).map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

