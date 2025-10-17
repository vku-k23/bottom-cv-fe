'use client'

import { useState } from 'react'
import { Search, MapPin, Layers, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface JobSearchSectionProps {
  onSearch?: (filters: SearchFilters) => void
}

export interface SearchFilters {
  keyword?: string
  location?: string
  category?: string
}

export function JobSearchSection({ onSearch }: JobSearchSectionProps) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: '',
    category: '',
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = () => {
    onSearch?.(filters)
  }

  return (
    <div className="w-full rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm">
      <div className="flex flex-col items-center gap-3 lg:flex-row">
        {/* Keyword Search */}
        <div className="relative w-full flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t('Jobs.jobTitleKeyword') || 'Job title, Keyword...'}
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="h-14 border-0 pr-4 pl-12 focus-visible:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        {/* Location */}
        <div className="relative w-full flex-1 lg:max-w-[300px]">
          <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t('Jobs.location') || 'Location'}
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="h-14 border-0 pr-4 pl-12 focus-visible:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        {/* Category */}
        <div className="relative w-full flex-1 lg:max-w-[300px]">
          <Layers className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="h-14 w-full cursor-pointer appearance-none rounded-md bg-white pr-10 pl-12 text-base text-gray-400 focus:outline-none"
          >
            <option value="">
              {t('Jobs.selectCategory') || 'Select Category'}
            </option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="customer-service">Customer Service</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        {/* Advanced Filter Button */}
        <Button
          variant="ghost"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="hidden h-14 px-6 text-gray-600 hover:text-gray-900 lg:flex"
        >
          {t('Jobs.advanceFilter') || 'Advance Filter'}
          <ChevronDown className="ml-2 h-5 w-5" />
        </Button>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        {/* Find Job Button */}
        <Button
          onClick={handleSearch}
          className="h-14 w-full bg-blue-600 px-8 font-medium text-white hover:bg-blue-700 lg:w-auto"
        >
          {t('Jobs.findJob') || 'Find Job'}
        </Button>
      </div>
    </div>
  )
}
