'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Search, Filter } from 'lucide-react'

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
}

interface SearchFilters {
  keyword: string
  location: string
  jobType: string
  experience: string
  salary: string
  tags: string[]
}

const JOB_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

const EXPERIENCE_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead/Principal' },
]

const SALARY_RANGES = [
  { value: 'all', label: 'All Salaries' },
  { value: '0-30k', label: '$0 - $30k' },
  { value: '30k-50k', label: '$30k - $50k' },
  { value: '50k-80k', label: '$50k - $80k' },
  { value: '80k-120k', label: '$80k - $120k' },
  { value: '120k+', label: '$120k+' },
]

const POPULAR_TAGS = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'AI',
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'UI/UX',
]

export function SearchFilter({ onSearch, onClear }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: '',
    jobType: 'all',
    experience: 'all',
    salary: 'all',
    tags: [],
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: 'all',
      experience: 'all',
      salary: 'all',
      tags: [],
    })
    onClear()
  }

  const hasActiveFilters =
    filters.keyword ||
    filters.location ||
    filters.jobType !== 'all' ||
    filters.experience !== 'all' ||
    filters.salary !== 'all' ||
    filters.tags.length > 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Jobs</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Job title, keywords, or company"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!hasActiveFilters}
            >
              Clear
            </Button>
            <Button onClick={handleSearch}>Search Jobs</Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <Select
                  value={filters.jobType}
                  onValueChange={(value) =>
                    handleFilterChange('jobType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <Select
                  value={filters.experience}
                  onValueChange={(value) =>
                    handleFilterChange('experience', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Salary Range
                </label>
                <Select
                  value={filters.salary}
                  onValueChange={(value) => handleFilterChange('salary', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Skills & Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                    {filters.tags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            {filters.tags.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Selected Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
