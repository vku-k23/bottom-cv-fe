'use client'

import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export interface CompanyCardProps {
  id: string
  name: string
  logo?: string
  location: string
  openJobs: number
}

export function CompanyCard({
  id,
  name,
  logo,
  location,
  openJobs,
}: CompanyCardProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between gap-8 rounded-xl border border-gray-100 bg-white p-8 transition-all hover:shadow-md">
      {/* Company Info */}
      <div className="flex items-center gap-5">
        {/* Company Logo */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-gray-50 p-5">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xl font-semibold text-gray-600">
              {name.charAt(0)}
            </span>
          )}
        </div>

        {/* Company Details */}
        <div className="space-y-3">
          <h3 className="text-xl font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-5">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{location}</span>
            </div>
            {/* Open Jobs */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Briefcase className="h-5 w-5" />
              <span>
                {openJobs} - {t('Companies.openJob') || 'open Job'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/companies/${id}`}>
        <Button
          size="sm"
          className="h-12 gap-3 bg-blue-50 px-6 font-semibold text-blue-600 uppercase hover:bg-blue-100"
        >
          {t('Companies.openPosition') || 'Open Position'}
          <ArrowRight className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
