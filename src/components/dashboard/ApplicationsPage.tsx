'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { ApplicationsTableRow, ApplicationData } from './ApplicationsTableRow'
import { Pagination } from '@/components/jobs/Pagination'

// Mock data
const MOCK_APPLICATIONS: ApplicationData[] = [
  {
    id: '1',
    jobTitle: 'Networking Engineer',
    company: 'Upwork',
    location: 'Washington',
    salary: '$50k-80k/month',
    jobType: 'Remote',
    dateApplied: 'Feb 2, 2019 19:28',
    status: 'active',
  },
  {
    id: '2',
    jobTitle: 'Product Designer',
    company: 'Dribbble',
    location: 'Dhaka',
    salary: '$50k-80k/month',
    jobType: 'Full Time',
    dateApplied: 'Dec 7, 2019 23:26',
    status: 'active',
  },
  {
    id: '3',
    jobTitle: 'Junior Graphic Designer',
    company: 'Apple',
    location: 'Brazil',
    salary: '$50k-80k/month',
    jobType: 'Temporary',
    dateApplied: 'Feb 2, 2019 19:28',
    status: 'active',
  },
  {
    id: '4',
    jobTitle: 'Visual Designer',
    company: 'Microsoft',
    location: 'Wisconsin',
    salary: '$50k-80k/month',
    jobType: 'Contract Base',
    dateApplied: 'Dec 7, 2019 23:26',
    status: 'active',
  },
  {
    id: '5',
    jobTitle: 'Marketing Officer',
    company: 'Twitter',
    location: 'United States',
    salary: '$50k-80k/month',
    jobType: 'Full Time',
    dateApplied: 'Dec 4, 2019 21:42',
    status: 'active',
  },
  {
    id: '6',
    jobTitle: 'UI/UX Designer',
    company: 'Facebook',
    location: 'North Dakota',
    salary: '$50k-80k/month',
    jobType: 'Full Time',
    dateApplied: 'Dec 30, 2019 07:52',
    status: 'active',
  },
  {
    id: '7',
    jobTitle: 'Software Engineer',
    company: 'Slack',
    location: 'New York',
    salary: '$50k-80k/month',
    jobType: 'Full Time',
    dateApplied: 'Dec 30, 2019 05:18',
    status: 'active',
  },
  {
    id: '8',
    jobTitle: 'Front End Developer',
    company: 'Reddit',
    location: 'Michigan',
    salary: '$50k-80k/month',
    jobType: 'Full Time',
    dateApplied: 'Mar 20, 2019 23:14',
    status: 'active',
  },
]

export function ApplicationsPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightedId, setHighlightedId] = useState<string | null>('4') // Visual Designer is highlighted in design
  const perPage = 8
  const totalPages = Math.ceil(MOCK_APPLICATIONS.length / perPage)

  const handleViewDetails = (id: string) => {
    setHighlightedId(id)
    console.log('View details:', id)
    // TODO: Navigate to job details page
  }

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const currentApplications = MOCK_APPLICATIONS.slice(startIndex, endIndex)

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-lg font-medium text-gray-900">
        {t('Dashboard.appliedJobs')} ({MOCK_APPLICATIONS.length})
      </h1>

      {/* Table Container */}
      <div className="space-y-2">
        {/* Table Header */}
        <div className="flex items-center gap-5 rounded bg-gray-50 px-5 py-2.5">
          <div className="w-[432px] text-xs font-normal text-gray-700 uppercase">
            {t('Applications.jobs') || 'JOBS'}
          </div>
          <div className="w-[131px] text-xs font-normal text-gray-700 uppercase">
            {t('Applications.dateApplied') || 'DATE APPLIED'}
          </div>
          <div className="w-[120px] text-xs font-normal text-gray-700 uppercase">
            {t('Applications.status') || 'STATUS'}
          </div>
          <div className="w-[201px] text-xs font-normal text-gray-700 uppercase">
            {t('Applications.action') || 'ACTION'}
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {currentApplications.map((application) => (
            <ApplicationsTableRow
              key={application.id}
              application={application}
              isHighlighted={application.id === highlightedId}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
