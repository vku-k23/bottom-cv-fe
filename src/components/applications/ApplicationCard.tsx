'use client'

import { Download } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ApplyResponse } from '@/lib/applicationService'
import { format } from 'date-fns'

interface ApplicationCardProps {
  application: ApplyResponse
  userInfo?: {
    firstName?: string
    lastName?: string
    avatar?: string
    experience?: string
    education?: string
  }
  onDownloadCV?: (applicationId: number) => void
}

export function ApplicationCard({
  application,
  userInfo,
  onDownloadCV,
}: ApplicationCardProps) {
  const candidateName =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo.firstName} ${userInfo.lastName}`
      : `User ${application.userId}`

  const initials =
    userInfo?.firstName && userInfo?.lastName
      ? `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`
      : `U${application.userId}`

  const appliedDate = application.createdAt
    ? format(new Date(application.createdAt), 'MMM dd, yyyy')
    : 'N/A'

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Candidate Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-500">
          {userInfo?.avatar ? (
            <Image
              src={userInfo.avatar}
              alt={candidateName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-white">{initials}</span>
          )}
        </div>

        {/* Name and Title */}
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-medium text-gray-900">{candidateName}</p>
          <p className="text-sm text-gray-500">
            {application.coverLetter
              ? application.coverLetter.substring(0, 30) + '...'
              : 'Application'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {userInfo?.experience && (
          <p className="text-sm text-gray-600">{userInfo.experience}</p>
        )}
        {userInfo?.education && (
          <p className="text-sm text-gray-600">
            Education: {userInfo.education}
          </p>
        )}
        <p className="text-sm text-gray-600">Applied: {appliedDate}</p>
      </div>

      {/* Download CV Button */}
      {application.cvUrl && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-500 hover:text-primary-600 flex items-center gap-1.5"
          onClick={() => onDownloadCV?.(application.id)}
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Download CV</span>
        </Button>
      )}
    </div>
  )
}
