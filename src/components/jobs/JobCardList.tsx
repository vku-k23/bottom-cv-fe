'use client'

import { MapPin, Briefcase, DollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { JobCardProps } from './JobCard'

export function JobCardList({
  id,
  title,
  company,
  companyLogo,
  location,
  jobType,
  salary,
  featured = false,
}: JobCardProps) {
  return (
    <Link href={`/jobs/${id}`} className="block">
      <div className="group flex items-center justify-between gap-6 rounded-xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md">
        {/* Left Section: Company Logo + Info */}
        <div className="flex min-w-0 flex-1 items-center gap-5">
          {/* Company Logo */}
          <div className="flex size-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt={company}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
                <span className="text-lg font-semibold text-gray-600">
                  {company.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="min-w-0 flex-1">
            {/* Job Title */}
            <h3 className="mb-2 truncate text-xl font-medium text-gray-900 transition-colors group-hover:text-blue-600">
              {title}
            </h3>

            {/* Company Name & Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{company}</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span>{jobType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span>{salary}</span>
              </div>
              {featured && (
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Apply Button */}
        <Button
          className="h-12 bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700"
          onClick={(e) => {
            // Prevent link navigation, let the parent Link handle it
            e.preventDefault()
          }}
        >
          Apply Now
        </Button>
      </div>
    </Link>
  )
}
