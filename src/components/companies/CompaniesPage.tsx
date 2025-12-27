'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from '@/components/jobs/Breadcrumb'
import {
  CompaniesSearchSection,
  CompanySearchFilters,
} from './CompaniesSearchSection'
import { CompaniesFilterSidebar, FilterState } from './CompaniesFilterSidebar'
import { CompanyCard, CompanyCardProps } from './CompanyCard'
import { Pagination } from '@/components/jobs/Pagination'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock data
const MOCK_COMPANIES: CompanyCardProps[] = [
  {
    id: '1',
    name: 'Dribbble',
    location: 'United States',
    openJobs: 3,
  },
  {
    id: '2',
    name: 'Udemy',
    location: 'China',
    openJobs: 3,
  },
  {
    id: '3',
    name: 'Figma',
    location: 'United States',
    openJobs: 3,
  },
  {
    id: '4',
    name: 'Twitter',
    location: 'Australia',
    openJobs: 3,
  },
  {
    id: '5',
    name: 'Instagram',
    location: 'Australia',
    openJobs: 3,
  },
  {
    id: '6',
    name: 'Google',
    location: 'Australia',
    openJobs: 3,
  },
  {
    id: '7',
    name: 'Slack',
    location: 'Germany',
    openJobs: 3,
  },
  {
    id: '8',
    name: 'Apple',
    location: 'United States',
    openJobs: 3,
  },
  {
    id: '9',
    name: 'Youtube',
    location: 'Canada',
    openJobs: 3,
  },
  {
    id: '10',
    name: 'Reddit',
    location: 'France',
    openJobs: 3,
  },
  {
    id: '11',
    name: 'Upwork',
    location: 'China',
    openJobs: 3,
  },
  {
    id: '12',
    name: 'Microsoft',
    location: 'United States',
    openJobs: 3,
  },
]

export function CompaniesPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')
  const [perPage, setPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(false)

  const totalPages = Math.ceil(MOCK_COMPANIES.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const currentCompanies = MOCK_COMPANIES.slice(startIndex, endIndex)

  const handleSearch = (filters: CompanySearchFilters) => {
    console.log('Search filters:', filters)
    // TODO: Implement search functionality
  }

  const handleFilterChange = (filters: FilterState) => {
    console.log('Filter changed:', filters)
    // TODO: Implement filter functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          title={t('Companies.findEmployers') || 'Find Employers'}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            { label: t('Companies.findEmployers') || 'Find Employers' },
          ]}
        />

        {/* Search Section */}
        <div className="mb-6">
          <CompaniesSearchSection onSearch={handleSearch} />
        </div>

        {/* Filter Button & Controls */}
        <div className="mb-6 flex items-center justify-between">
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

            {/* View Type Toggle - Hidden for now since design shows list view only */}
            {/* <div className="flex rounded-md border border-gray-200 bg-white">
              <button className="p-2 text-gray-400">
                <Grid className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-50 text-gray-900">
                <List className="h-5 w-5" />
              </button>
            </div> */}
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
            <div className="space-y-6">
              {currentCompanies.map((company) => (
                <CompanyCard key={company.id} {...company} />
              ))}
            </div>
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
