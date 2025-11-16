'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export interface FilterState {
  organizationType: string[]
  locationRadius: number
}

interface CompaniesFilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void
}

export function CompaniesFilterSidebar({
  onFilterChange,
}: CompaniesFilterSidebarProps) {
  const { t } = useTranslation()
  const [locationRadius, setLocationRadius] = useState(32)
  const [organizationType, setOrganizationType] = useState<string[]>([])
  const [showLocationRadius, setShowLocationRadius] = useState(true)
  const [showOrgType, setShowOrgType] = useState(true)

  const orgTypes = [
    'Government',
    'Semi Government',
    'NGO',
    'Private Company',
    'International Agencies',
    'Others',
  ]

  const handleOrgTypeChange = (type: string) => {
    const newTypes = organizationType.includes(type)
      ? organizationType.filter((t) => t !== type)
      : [...organizationType, type]

    setOrganizationType(newTypes)
    onFilterChange?.({ organizationType: newTypes, locationRadius })
  }

  const handleRadiusChange = (value: number) => {
    setLocationRadius(value)
    onFilterChange?.({ organizationType, locationRadius: value })
  }

  return (
    <div className="space-y-0 rounded-xl border border-gray-100 bg-white">
      {/* Location Radius */}
      <div className="space-y-4 p-8 pb-6">
        <button
          onClick={() => setShowLocationRadius(!showLocationRadius)}
          className="flex w-full items-center justify-between gap-12"
        >
          <div className="flex gap-1.5">
            <span className="text-lg font-medium text-gray-900">
              {t('Companies.locationRadius') || 'Location Radius:'}
            </span>
            <span className="text-lg font-normal text-blue-600">
              {locationRadius} {t('Companies.miles') || 'miles'}
            </span>
          </div>
          <ChevronDown
            className={`h-6 w-6 text-white transition-transform ${
              showLocationRadius ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showLocationRadius && (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={locationRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200"
              style={{
                background: `linear-gradient(to right, #0A65CC 0%, #0A65CC ${locationRadius}%, #E4E5E8 ${locationRadius}%, #E4E5E8 100%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100" />

      {/* Organization Type */}
      <div className="space-y-5 p-8 pt-6">
        <button
          onClick={() => setShowOrgType(!showOrgType)}
          className="flex w-full items-center justify-between"
        >
          <span className="text-xl font-medium text-gray-900">
            {t('Companies.organizationType') || 'Organization Type'}
          </span>
          <ChevronDown
            className={`h-6 w-6 text-white transition-transform ${
              showOrgType ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showOrgType && (
          <div className="space-y-4">
            {orgTypes.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={organizationType.includes(type)}
                  onChange={() => handleOrgTypeChange(type)}
                  className="border-1.5 h-5.5 w-5.5 cursor-pointer rounded-full border-gray-200 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

