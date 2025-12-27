'use client'

import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { CompanyCardProps } from './CompanyCard'

export function CompanyCardList({
  id,
  name,
  logo,
  location,
  openJobs,
}: CompanyCardProps) {
  const { t } = useTranslation()

  return (
    <Link href={`/companies/${id}`} className="block">
      <div className="group flex items-center justify-between gap-6 rounded-xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md">
        {/* Left Section: Company Logo + Info */}
        <div className="flex min-w-0 flex-1 items-center gap-5">
          {/* Company Logo */}
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-gray-50">
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {name.charAt(0)}
              </span>
            )}
          </div>

          {/* Company Info */}
          <div className="min-w-0 flex-1">
            {/* Company Name */}
            <h3 className="mb-2 truncate text-xl font-medium text-gray-900 transition-colors group-hover:text-blue-600">
              {name}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span>
                  {openJobs} - {t('Companies.openJob') || 'open Job'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Open Position Button */}
        <Button
          className="h-12 gap-3 bg-blue-50 px-6 font-semibold text-blue-600 uppercase hover:bg-blue-100"
          onClick={(e) => {
            // Prevent link navigation, let the parent Link handle it
            e.preventDefault()
          }}
        >
          {t('Companies.openPosition') || 'Open Position'}
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </Link>
  )
}
