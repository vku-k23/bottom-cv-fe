'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from './Breadcrumb'
import { JobSearchSection, SearchFilters } from './JobSearchSection'
import { FilterBar } from './FilterBar'
import { JobCard, JobCardProps } from './JobCard'
import { Pagination } from './Pagination'

// Mock data - Replace with real API calls
const MOCK_JOBS: JobCardProps[] = [
  {
    id: '1',
    title: 'Marketing Officer',
    company: 'Reddit',
    companyLogo: undefined,
    location: 'United Kingdom of Great Britain',
    jobType: 'Full Time',
    salary: '$30K-$35K',
    featured: true,
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Figma',
    companyLogo: undefined,
    location: 'Canada',
    jobType: 'Full Time',
    salary: '$50K-$70K',
    featured: true,
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Microsoft',
    companyLogo: undefined,
    location: 'Australia',
    jobType: 'Full Time',
    salary: '$40K-$50K',
    featured: false,
  },
  {
    id: '4',
    title: 'Front End Developer',
    company: 'Instagram',
    companyLogo: undefined,
    location: 'Australia',
    jobType: 'Contract Base',
    salary: '$50K-$80K',
    featured: true,
  },
  {
    id: '5',
    title: 'Junior Graphic Designer',
    company: 'Dribbble',
    companyLogo: undefined,
    location: 'United States',
    jobType: 'Temporary',
    salary: '$35K-$40K',
    featured: false,
  },
  {
    id: '6',
    title: 'Technical Support Specialist',
    company: 'Upwork',
    companyLogo: undefined,
    location: 'France',
    jobType: 'Full Time',
    salary: '$35K-$40K',
    featured: false,
  },
  {
    id: '7',
    title: 'Software Engineer',
    company: 'Facebook',
    companyLogo: undefined,
    location: 'United Kingdom of Great Britain',
    jobType: 'Part Time',
    salary: '$15K-$20K',
    featured: false,
  },
  {
    id: '8',
    title: 'Senior UX Designer',
    company: 'Twitter',
    companyLogo: undefined,
    location: 'Canada',
    jobType: 'Internship',
    salary: '$50K-$60K',
    featured: false,
  },
  {
    id: '9',
    title: 'Networking Engineer',
    company: 'Slack',
    companyLogo: undefined,
    location: 'Germany',
    jobType: 'Remote',
    salary: '$50K-$90K',
    featured: false,
  },
  {
    id: '10',
    title: 'Visual Designer',
    company: 'Freepik',
    companyLogo: undefined,
    location: 'China',
    jobType: 'Full Time',
    salary: '$10K-$15K',
    featured: true,
  },
  {
    id: '11',
    title: 'Interaction Designer',
    company: 'Youtube',
    companyLogo: undefined,
    location: 'Germany',
    jobType: 'Full Time',
    salary: '$20K-$25K',
    featured: false,
  },
  {
    id: '12',
    title: 'Senior UX Designer',
    company: 'Dribbble',
    companyLogo: undefined,
    location: 'California',
    jobType: 'Full-Time',
    salary: '$50k-80k/month',
    featured: true,
  },
]

export function JobsPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')
  const [perPage, setPerPage] = useState(12)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Design',
    'New York',
  ])

  const totalPages = Math.ceil(MOCK_JOBS.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const currentJobs = MOCK_JOBS.slice(startIndex, endIndex)

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters)
    // TODO: Implement search functionality
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleSaveJob = (id: string) => {
    console.log('Save job:', id)
    // TODO: Implement save job functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          title={t('Jobs.findJob') || 'Find Job'}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            { label: t('Jobs.findJob') || 'Find job' },
          ]}
        />

        {/* Search Section */}
        <div className="mb-6">
          <JobSearchSection onSearch={handleSearch} />
        </div>

        {/* Filter Bar */}
        <FilterBar
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          perPage={perPage}
          onPerPageChange={setPerPage}
          viewType={viewType}
          onViewTypeChange={setViewType}
        />

        {/* Job Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {t('Jobs.showingResults') || 'Showing'}{' '}
            <span className="font-medium text-gray-900">
              {startIndex + 1}-{Math.min(endIndex, MOCK_JOBS.length)}
            </span>{' '}
            {t('Jobs.of') || 'of'}{' '}
            <span className="font-medium text-gray-900">
              {MOCK_JOBS.length}
            </span>{' '}
            {t('Jobs.jobs') || 'jobs'}
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map((job) => (
            <JobCard key={job.id} {...job} onSave={handleSaveJob} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
