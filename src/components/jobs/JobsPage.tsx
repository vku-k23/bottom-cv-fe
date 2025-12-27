'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from './Breadcrumb'
import { JobSearchSection, SearchFilters } from './JobSearchSection'
import { FilterBar } from './FilterBar'
import { JobCard, JobCardProps } from './JobCard'
import { Pagination } from './Pagination'
import { apiClient, API_ENDPOINTS, JobResponse, ListResponse } from '@/lib/api'

export function JobsPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')
  const [perPage, setPerPage] = useState(12)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // API State
  const [jobs, setJobs] = useState<JobCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<ListResponse<JobResponse>>(
          `${API_ENDPOINTS.jobs.list}?page=${currentPage - 1}&size=${perPage}`
        )

        // Map backend response to JobCardProps
        const mappedJobs: JobCardProps[] = (response.data || []).map((job) => ({
          id: job.id.toString(),
          title: job.title,
          company: job.company.name,
          companyLogo: job.company.logo,
          location: job.location, // or job.company.addresses? using simplified location for now
          jobType: job.jobType.replace('_', ' '), // e.g. FULL_TIME -> FULL TIME
          salary: job.salary ? `$${job.salary}` : 'Negotiable',
          featured: false, // Backend doesn't support featured jobs yet
        }))

        setJobs(mappedJobs)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError('Failed to load jobs. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage, perPage, sortBy])

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters)
    // TODO: Connect search filters to API params
  }

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
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
              {jobs.length > 0 ? (currentPage - 1) * perPage + 1 : 0}-
              {Math.min(currentPage * perPage, totalElements)}
            </span>{' '}
            {t('Jobs.of') || 'of'}{' '}
            <span className="font-medium text-gray-900">{totalElements}</span>{' '}
            {t('Jobs.jobs') || 'jobs'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Job Cards Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
            {jobs.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No jobs found. Try adjusting your search filters.
              </div>
            )}
          </div>
        )}

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
