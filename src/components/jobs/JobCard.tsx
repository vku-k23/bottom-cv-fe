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
    ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-100 hover:shadow-xl'
    : 'bg-white border-gray-100 hover:shadow-lg'

  return (
    <div
      className={`group relative rounded-xl border p-8 transition-all duration-300 ${cardClasses}`}
    >
      {/* Bookmark Button */}
      <button
        onClick={() => onSave?.(id)}
        className="absolute top-6 right-6 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
        aria-label="Save job"
      >
        <Bookmark className="h-5 w-5" />
      </button>

      {/* Company Info */}
      <div className="mb-6 flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 p-3">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={company}
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-600">
              {company.charAt(0)}
            </span>
          )}
        </div>

        {/* Company Name & Location */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h3 className="truncate text-base font-medium text-gray-900">
              {company}
            </h3>
            {featured && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-normal text-red-500">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <Link
        href={`/jobs/${id}`}
        className={`mb-3 line-clamp-2 block text-xl font-medium transition-colors ${
          featured
            ? 'text-gray-900 hover:text-blue-600'
            : 'text-gray-900 hover:text-blue-600'
        }`}
      >
        {title}
      </Link>

      {/* Job Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{jobType}</span>
        <div className="h-1 w-1 rounded-full bg-gray-400" />
        <span>{salary}</span>
      </div>
    </div>
  )
}
