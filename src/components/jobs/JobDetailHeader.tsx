'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

export interface JobHeaderInfo {
  id: string
  title: string
  companyName: string
  companyLogo?: string
  industry: string
  companyBanner?: string
}

interface JobDetailHeaderProps {
  job: JobHeaderInfo
  onViewOpenPosition: () => void
}

export function JobDetailHeader({
  job,
  onViewOpenPosition,
}: JobDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl border border-border-gray bg-white p-10">
      {/* Left: Company Info */}
      <div className="flex items-center gap-6">
        {/* Company Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-md">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={job.companyName}
              width={80}
              height={80}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
              <span className="text-2xl font-bold text-gray-600">
                {job.companyName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Company Details */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl font-medium text-text-dark">{job.companyName}</h1>
          <p className="text-base font-normal text-text-gray">{job.industry}</p>
        </div>
      </div>

      {/* Right: View Open Position Button */}
      <Button
        onClick={onViewOpenPosition}
        className="flex h-14 items-center gap-3 rounded bg-blue-primary px-8 text-base font-semibold capitalize text-white hover:bg-blue-600"
      >
        View Open Position
        <ArrowRightIcon className="h-6 w-6" style={{ color: 'white' }} />
      </Button>
    </div>
  )
}