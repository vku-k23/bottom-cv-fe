'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import LinkIcon from '@/assets/icons/link.svg'
import PhoneIcon from '@/assets/icons/phone-blue.svg'
import EnvelopeIcon from '@/assets/icons/envelope-blue.svg'
import BookmarkIcon from '@/assets/icons/bookmark-outline.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

export interface JobHeaderInfo {
  id: string
  title: string
  companyName: string
  companyLogo?: string
  featured?: boolean
  jobType: string
  website?: string
  phone?: string
  email?: string
  expirationDate?: string
}

interface JobDetailHeaderProps {
  job: JobHeaderInfo
  onApply: () => void
  onSave: () => void
}

export function JobDetailHeader({
  job,
  onApply,
  onSave,
}: JobDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      {/* Left: Job Info */}
      <div className="flex gap-6">
        {/* Company Logo */}
        <div className="flex h-20 w-24 items-center justify-center rounded-full">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={job.companyName}
              width={128}
              height={128}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl font-bold text-gray-600">
                {job.companyName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-col gap-3">
          {/* Title & Badges */}
          <div className="flex items-center gap-2">
            <h1 className="text-text-dark text-2xl font-medium">{job.title}</h1>
            {job.featured && (
              <span className="text-red-accent text-sm font-normal">
                Featured
              </span>
            )}
            <span className="text-sm font-normal text-[#0066ff]">
              {job.jobType}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex w-3/5 items-center gap-5">
            {job.website && (
              <div className="flex w-3/5 items-center gap-1.5">
                <LinkIcon className="h-5 w-10" style={{ color: '#0a65cc' }} />
                <a
                  href={job.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-primary line-clamp-1 text-base font-normal text-[#474c54]"
                >
                  {job.website}
                </a>
              </div>
            )}
            {job.phone && (
              <div className="flex items-center gap-1.5">
                <PhoneIcon className="h-5 w-5" style={{ color: '#0066ff' }} />
                <span className="text-base font-normal text-[#474c54]">
                  {job.phone}
                </span>
              </div>
            )}
            {job.email && (
              <div className="flex items-center gap-1.5">
                <EnvelopeIcon
                  className="h-5 w-5"
                  style={{ color: '#0a65cc' }}
                />
                <span className="text-base font-normal text-[#474c54]">
                  {job.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          {/* Bookmark Button */}
          <button
            onClick={onSave}
            className="flex h-14 w-14 items-center justify-center rounded border border-[#0a65cc]"
          >
            <BookmarkIcon className="h-5 w-5" style={{ color: '#0a65cc' }} />
          </button>

          {/* Apply Button */}
          <Button
            onClick={onApply}
            className="bg-blue-primary flex h-14 items-center gap-3 rounded px-6 text-base font-semibold text-white capitalize hover:bg-blue-600"
          >
            Apply now
            <ArrowRightIcon className="h-6 w-6" style={{ color: 'white' }} />
          </Button>
        </div>

        {/* Expiration Notice */}
        {job.expirationDate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-light-gray font-normal">
              Job expire in:
            </span>
            <span className="font-medium text-[#e05151]">
              {job.expirationDate}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
