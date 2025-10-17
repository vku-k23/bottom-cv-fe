'use client'

import { X, ChevronDown, Grid, List } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface FilterBarProps {
  activeFilters?: string[]
  onRemoveFilter?: (filter: string) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  perPage?: number
  onPerPageChange?: (perPage: number) => void
  viewType?: 'grid' | 'list'
  onViewTypeChange?: (viewType: 'grid' | 'list') => void
}

export function FilterBar({
  activeFilters = [],
  onRemoveFilter,
  sortBy = 'latest',
  onSortChange,
  perPage = 12,
  onPerPageChange,
  viewType = 'grid',
  onViewTypeChange,
}: FilterBarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
      {/* Active Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {activeFilters.map((filter) => (
          <div
            key={filter}
            className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-700"
          >
            <span>{filter}</span>
            <button
              onClick={() => onRemoveFilter?.(filter)}
              className="rounded-full text-gray-400 hover:text-gray-600"
              aria-label={`Remove ${filter} filter`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        {/* Sort By */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="h-12 cursor-pointer appearance-none rounded-md border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          >
            <option value="latest">{t('Jobs.latest') || 'Latest'}</option>
            <option value="oldest">{t('Jobs.oldest') || 'Oldest'}</option>
            <option value="salary-high">
              {t('Jobs.salaryHighToLow') || 'Salary: High to Low'}
            </option>
            <option value="salary-low">
              {t('Jobs.salaryLowToHigh') || 'Salary: Low to High'}
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Per Page */}
        <div className="relative">
          <select
            value={perPage}
            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
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
            onClick={() => onViewTypeChange?.('grid')}
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
            onClick={() => onViewTypeChange?.('list')}
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
  )
}
