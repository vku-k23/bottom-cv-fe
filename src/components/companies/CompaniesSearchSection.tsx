'use client'

import { useState } from 'react'
import { Search, MapPin, Layers, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface CompaniesSearchSectionProps {
  onSearch?: (filters: CompanySearchFilters) => void
}

export interface CompanySearchFilters {
  keyword?: string
  location?: string
  category?: string
}

export function CompaniesSearchSection({
  onSearch,
}: CompaniesSearchSectionProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<CompanySearchFilters>({
    keyword: '',
    location: '',
    category: '',
  })

  const handleSearch = () => {
    onSearch?.(filters)
  }

  return (
    <div className="w-full rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm">
      <div className="flex items-center gap-0">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={
              t('Companies.jobTitleKeyword') || 'Job title, Keyword...'
            }
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="h-14 border-0 pr-4 pl-12 focus-visible:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-gray-100" />

        {/* Location */}
        <div className="relative w-full max-w-[321px]">
          <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t('Companies.location') || 'Location'}
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="h-14 border-0 pr-4 pl-12 focus-visible:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-gray-100" />

        {/* Category */}
        <div className="relative w-full max-w-[320px]">
          <Layers className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="h-14 w-full cursor-pointer appearance-none rounded-md bg-white pr-10 pl-12 text-base text-gray-400 focus:outline-none"
          >
            <option value="">
              {t('Companies.selectCategory') || 'Select Category'}
            </option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="retail">Retail</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Find Job Button */}
        <Button
          onClick={handleSearch}
          className="ml-3 h-14 w-auto rounded bg-blue-600 px-8 font-semibold text-white uppercase hover:bg-blue-700"
        >
          {t('Companies.findJob') || 'Find Job'}
        </Button>
      </div>
    </div>
  )
}

