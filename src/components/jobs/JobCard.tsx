'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ApplyJobModal } from './ApplyJobModal'

export interface JobCardProps {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  jobType: string
  salary: string
  featured?: boolean
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
}: JobCardProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

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
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-md">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={company}
              width={48}
              height={48}
              className="h-full w-full object-cover"
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
            <h3 className="text-text-dark text-base font-medium">{company}</h3>
            {featured && (
              <span className="text-red-accent inline-flex items-center text-sm font-normal">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="text-text-gray h-4.5 w-4.5 flex-shrink-0" />
            <span className="text-text-muted text-sm font-normal">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Job Title */}
      <Link
        href={`/jobs/${id}`}
        className="hover:text-blue-primary mb-2 block text-xl font-medium text-[#191f33] transition-colors"
      >
        {title}
      </Link>

      {/* Job Info */}
      <div className="text-text-light-gray mb-4 flex items-center gap-2 text-sm font-normal">
        <span>{jobType}</span>
        <div className="bg-text-light-gray h-1 w-1 rounded-full" />
        <span>{salary}</span>
      </div>

      {/* Apply Button */}
      <Button
        variant="outline"
        className="w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        onClick={() => setIsApplyModalOpen(true)}
      >
        Apply Now
      </Button>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={Number(id)}
        jobTitle={title}
      />
    </div>
  )
}
