'use client'

import { MapPin, DollarSign, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export interface ApplicationData {
  id: string
  jobTitle: string
  company: string
  companyLogo?: string
  location: string
  salary: string
  jobType: string
  dateApplied: string
  status: 'active' | 'rejected' | 'pending'
}

interface ApplicationsTableRowProps {
  application: ApplicationData
  isHighlighted?: boolean
  onViewDetails: (id: string) => void
}

export function ApplicationsTableRow({
  application,
  isHighlighted = false,
  onViewDetails,
}: ApplicationsTableRowProps) {
  const rowClasses = isHighlighted
    ? 'border-blue-600 bg-white shadow-lg'
    : 'border-transparent'

  const statusColors = {
    active: 'text-green-600',
    rejected: 'text-red-600',
    pending: 'text-yellow-600',
  }

  return (
    <>
      <div
        className={`flex items-center gap-5 rounded-lg border px-5 py-5 transition-all ${rowClasses}`}
      >
        {/* Job Info - 432px */}
        <div className="flex w-[432px] items-start gap-4">
          {/* Company Logo */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded bg-gray-100 p-4">
            {application.companyLogo ? (
              <Image
                src={application.companyLogo}
                alt={application.company}
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {application.company.charAt(0)}
              </span>
            )}
          </div>

          {/* Job Details */}
          <div className="flex flex-col gap-2.5">
            {/* Title & Badge */}
            <div className="flex items-center gap-2">
              <Link
                href={`/jobs/${application.id}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {application.jobTitle}
              </Link>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-normal text-blue-600">
                {application.jobType}
              </span>
            </div>

            {/* Location & Salary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{application.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <DollarSign className="h-5 w-5" />
                <span>{application.salary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Applied - 131px */}
        <div className="w-[131px] text-sm text-gray-600">
          {application.dateApplied}
        </div>

        {/* Status - 120px */}
        <div className="flex w-[120px] items-center gap-1.5">
          <Check className="h-4 w-4 text-gray-900" />
          <span
            className={`text-sm font-medium ${statusColors[application.status]}`}
          >
            {application.status.charAt(0).toUpperCase() +
              application.status.slice(1)}
          </span>
        </div>

        {/* Action - 201px */}
        <div className="w-[201px]">
          <Button
            onClick={() => onViewDetails(application.id)}
            variant={isHighlighted ? 'default' : 'outline'}
            size="sm"
            className={`h-12 w-full font-semibold uppercase ${
              isHighlighted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border-gray-200 bg-gray-50 text-blue-600 hover:bg-gray-100'
            }`}
          >
            View details
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100" />
    </>
  )
}
