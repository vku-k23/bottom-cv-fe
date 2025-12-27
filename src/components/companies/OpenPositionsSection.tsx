'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { JobCard, JobCardProps } from '@/components/jobs/JobCard'

interface OpenPositionsSectionProps {
  companyName: string
  jobs: JobCardProps[]
}

export function OpenPositionsSection({
  companyName: _companyName,
  jobs,
}: OpenPositionsSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-12 text-4xl font-medium text-gray-900">
          {t('CompanyDetail.openPosition') || 'Open Position'} ({jobs.length})
        </h2>

        {/* Jobs Grid - 2 columns */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {jobs.slice(0, Math.ceil(jobs.length / 2)).map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          <div className="space-y-6">
            {jobs.slice(Math.ceil(jobs.length / 2)).map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
