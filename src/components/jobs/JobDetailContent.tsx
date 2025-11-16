'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'

export interface JobContent {
  description: string[]
  responsibilities: string[]
}

interface JobDetailContentProps {
  content: JobContent
  onShare?: (platform: string) => void
}

export function JobDetailContent({ content, onShare }: JobDetailContentProps) {
  const { t } = useTranslation()

  const socialPlatforms = [
    { name: 'Facebook', color: 'text-blue-600 border-blue-200' },
    { name: 'Twitter', color: 'text-blue-400 border-blue-200' },
    { name: 'Pinterest', color: 'text-red-600 border-red-200' },
  ]

  return (
    <div className="space-y-8">
      {/* Job Description */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">
          {t('JobDetail.jobDescription') || 'Job Description'}
        </h2>
        <div className="space-y-4">
          {content.description.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-gray-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">
          {t('JobDetail.responsibilities') || 'Responsibilities'}
        </h2>
        <ul className="space-y-3">
          {content.responsibilities.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-base text-gray-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Share this job */}
      <div className="flex items-center gap-5">
        <span className="text-base font-normal text-gray-900">
          {t('JobDetail.shareThisJob') || 'Share this job:'}
        </span>
        <div className="flex gap-2">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              onClick={() => onShare?.(platform.name)}
              className={`h-10 gap-2 border ${platform.color} hover:bg-gray-50`}
            >
              <span className="text-sm">{platform.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

