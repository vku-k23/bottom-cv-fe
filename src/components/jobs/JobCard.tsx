'use client'

import { MapPin, Bookmark } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export interface JobCardProps {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  jobType: string
  salary: string
  featured?: boolean
  onSave?: (id: string) => void
}

export function JobCard({
  id,
  title,
  company,
  companyLogo,
  location,
  jobType,
  salary,
  featured = false,
  onSave,
}: JobCardProps) {
  const cardClasses = featured
    ? 'bg-gradient-to-r from-[#fff6e6] to-white border-border-light'
    : 'bg-white border-border-light'

  return (
    <div
      className={`group relative rounded-xl border p-6 transition-all duration-300 ${cardClasses}`}
    >
      {/* Company Info */}
      <div className="mb-4 flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={company}
              width={24}
              height={24}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
              <span className="text-xs font-semibold text-gray-600">
                {company.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Company Name & Location */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h3 className="text-base font-medium text-text-dark">
              {company}
            </h3>
            {featured && (
              <span className="inline-flex items-center text-sm font-normal text-red-accent">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4.5 w-4.5 flex-shrink-0 text-text-gray" />
            <span className="text-sm font-normal text-text-muted">{location}</span>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <Link
        href={`/jobs/${id}`}
        className="mb-2 block text-xl font-medium text-[#191f33] transition-colors hover:text-blue-primary"
      >
        {title}
      </Link>

      {/* Job Info */}
      <div className="flex items-center gap-2 text-sm font-normal text-text-light-gray">
        <span>{jobType}</span>
        <div className="h-1 w-1 rounded-full bg-text-light-gray" />
        <span>{salary}</span>
      </div>
    </div>
  )
}
