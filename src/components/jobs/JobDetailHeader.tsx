'use client'

import { Link2, Phone, Mail, Bookmark, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()

  return (
    <div className="flex items-start justify-between gap-8 py-8">
      {/* Left: Job Info */}
      <div className="flex gap-6">
        {/* Company Logo */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={job.companyName}
              width={96}
              height={96}
              className="h-full w-full rounded-full object-contain"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {job.companyName.charAt(0)}
            </span>
          )}
        </div>

        {/* Job Details */}
        <div className="space-y-3">
          {/* Title & Badges */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium text-gray-900">{job.title}</h1>
            {job.featured && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-normal text-red-500">
                {t('Jobs.featured') || 'Featured'}
              </span>
            )}
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-normal text-blue-600">
              {job.jobType}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-5">
            {job.website && (
              <div className="flex items-center gap-2 text-gray-700">
                <Link2 className="h-5 w-5" />
                <a
                  href={job.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:text-blue-600"
                >
                  {job.website}
                </a>
              </div>
            )}
            {job.phone && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Phone className="h-5 w-5" />
                <span className="text-base">{job.phone}</span>
              </div>
            )}
            {job.email && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Mail className="h-5 w-5" />
                <span className="text-base">{job.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-4">
          {/* Bookmark Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onSave}
            className="h-14 w-14 rounded border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Bookmark className="h-5 w-5" />
          </Button>

          {/* Apply Button */}
          <Button
            onClick={onApply}
            size="lg"
            className="h-14 bg-blue-600 px-8 font-semibold text-white uppercase hover:bg-blue-700"
          >
            {t('JobDetail.applyNow') || 'Apply now'}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Expiration Notice */}
        {job.expirationDate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">
              {t('JobDetail.jobExpireIn') || 'Job expire in:'}
            </span>
            <span className="font-medium text-red-500">
              {job.expirationDate}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
