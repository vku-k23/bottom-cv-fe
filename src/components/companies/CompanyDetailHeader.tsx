'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export interface CompanyHeaderInfo {
  id: string
  name: string
  logo?: string
  category: string
  coverImage?: string
}

interface CompanyDetailHeaderProps {
  company: CompanyHeaderInfo
  onViewPositions: () => void
}

export function CompanyDetailHeader({
  company,
  onViewPositions,
}: CompanyDetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-0">
      {/* Cover Image */}
      {company.coverImage && (
        <div className="relative h-[312px] w-full overflow-hidden rounded-b-lg border border-gray-100">
          <Image
            src={company.coverImage}
            alt={`${company.name} cover`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Company Info Card */}
      <div className="flex items-center justify-between gap-12 rounded-xl border border-gray-100 bg-white p-10">
        {/* Left: Company Info */}
        <div className="flex items-center gap-6">
          {/* Company Logo */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={80}
                height={80}
                className="h-full w-full rounded-md object-contain"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {company.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Company Name & Category */}
          <div className="space-y-2.5">
            <h1 className="text-2xl font-medium text-gray-900">
              {company.name}
            </h1>
            <p className="text-base text-gray-600">{company.category}</p>
          </div>
        </div>

        {/* Right: Action Button */}
        <Button
          onClick={onViewPositions}
          size="lg"
          className="h-14 gap-3 bg-blue-600 px-8 font-semibold text-white uppercase hover:bg-blue-700"
        >
          {t('CompanyDetail.viewOpenPosition') || 'View Open Position'}
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
