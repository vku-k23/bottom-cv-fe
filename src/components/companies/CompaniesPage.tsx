'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from '@/components/jobs/Breadcrumb'
import {
  CompaniesSearchSection,
  CompanySearchFilters,
} from './CompaniesSearchSection'
import { CompaniesFilterSidebar, FilterState } from './CompaniesFilterSidebar'
import { CompanyCard, CompanyCardProps } from './CompanyCard'
import { CompanyCardList } from './CompanyCardList'
import { Pagination } from '@/components/jobs/Pagination'
import { SlidersHorizontal, ChevronDown, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  apiClient,
  API_ENDPOINTS,
  CompanyResponse,
  ListResponse,
} from '@/lib/api'

export function CompaniesPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')
  const [perPage, setPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(false)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')

  // API State
  const [companies, setCompanies] = useState<CompanyCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [_totalElements, setTotalElements] = useState(0)

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Map sortBy to backend format
        let backendSortBy = 'id'
        let backendSortType = 'desc'

        switch (sortBy) {
          case 'latest':
            backendSortBy = 'id'
            backendSortType = 'desc'
            break
          case 'oldest':
            backendSortBy = 'id'
            backendSortType = 'asc'
            break
          case 'name-az':
            backendSortBy = 'name'
            backendSortType = 'asc'
            break
          case 'name-za':
            backendSortBy = 'name'
            backendSortType = 'desc'
            break
        }

        const response = await apiClient.get<ListResponse<CompanyResponse>>(
          `${API_ENDPOINTS.companies.list}?pageNo=${currentPage - 1}&pageSize=${perPage}&sortBy=${backendSortBy}&sortType=${backendSortType}`
        )

        // Map backend response to CompanyCardProps
        const mappedCompanies: CompanyCardProps[] = (response.data || []).map(
          (company) => ({
            id: company.id.toString(),
            name: company.name,
            location: company.addresses
              ? Object.values(company.addresses)[0] || 'N/A'
              : 'N/A',
            openJobs: company.jobs?.length || 0, // Use actual jobs count from API
            logo: company.logo,
          })
        )

        setCompanies(mappedCompanies)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } catch (err) {
        console.error('Failed to fetch companies:', err)
        setError('Failed to load companies. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [currentPage, perPage, sortBy])

  const handleSearch = (filters: CompanySearchFilters) => {
    console.log('Search filters:', filters)
    // TODO: Implement search functionality
  }

  const handleFilterChange = (filters: FilterState) => {
    console.log('Filter changed:', filters)
    // TODO: Implement filter functionality
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb
          title={t('Companies.findEmployers') || 'Find Employers'}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            { label: t('Companies.findEmployers') || 'Find Employers' },
          ]}
        />

        {/* Search Section */}
        <div>
          <CompaniesSearchSection onSearch={handleSearch} />
        </div>

        {/* Filter Button & Controls */}
        <div className="my-3 flex items-center justify-between">
          {/* Filter Toggle Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-12 items-center gap-3 bg-blue-600 px-6 font-semibold text-white uppercase hover:bg-blue-700"
          >
            <SlidersHorizontal className="h-6 w-6" />
            {t('Companies.filter') || 'Filter'}
          </Button>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="latest">{t('Jobs.latest') || 'Latest'}</option>
                <option value="oldest">{t('Jobs.oldest') || 'Oldest'}</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Per Page */}
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="h-12 cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
              >
                <option value={12}>12 {t('Jobs.perPage') || 'per page'}</option>
                <option value={24}>24 {t('Jobs.perPage') || 'per page'}</option>
                <option value={36}>36 {t('Jobs.perPage') || 'per page'}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>

            {/* View Type Toggle */}
            <div className="flex rounded-md border border-gray-200 bg-white">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 transition-colors ${
                  viewType === 'grid'
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 transition-colors ${
                  viewType === 'list'
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 pb-12 lg:grid-cols-[424px_1fr]">
          {/* Sidebar Filters */}
          {showFilters && (
            <div>
              <CompaniesFilterSidebar onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Companies List */}
          <div className={showFilters ? '' : 'lg:col-span-2'}>
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

            {/* Companies Grid/List */}
            {!isLoading && !error && (
              <div
                className={
                  viewType === 'grid'
                    ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {companies.map((company) =>
                  viewType === 'grid' ? (
                    <CompanyCard key={company.id} {...company} />
                  ) : (
                    <CompanyCardList key={company.id} {...company} />
                  )
                )}
                {companies.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No companies found. Try adjusting your search filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pb-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
