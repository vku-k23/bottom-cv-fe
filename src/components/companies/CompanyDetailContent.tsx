'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'

export interface CompanyContent {
  description: string
  benefits: string[]
  vision: string
}

interface CompanyDetailContentProps {
  content: CompanyContent
  onShare?: (platform: string) => void
}

export function CompanyDetailContent({
  content,
  onShare,
}: CompanyDetailContentProps) {
  const { t } = useTranslation()

  const socialPlatforms = [
    { name: 'Facebook', color: 'text-blue-600 border-gray-100' },
    { name: 'Twitter', color: 'text-blue-400 border-gray-100' },
    { name: 'Pinterest', color: 'text-red-600 border-gray-100' },
  ]

  return (
    <div className="space-y-9">
      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          {t('CompanyDetail.description') || 'Description'}
        </h2>
        <p className="text-base leading-relaxed text-gray-600">
          {content.description}
        </p>
      </div>

      {/* Company Benefits */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          {t('CompanyDetail.companyBenefits') || 'Company Benefits'}
        </h2>
        <ul className="space-y-3">
          {content.benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-base text-gray-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Company Vision */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          {t('CompanyDetail.companyVision') || 'Company Vision'}
        </h2>
        <p className="text-base leading-relaxed text-gray-600">
          {content.vision}
        </p>
      </div>

      {/* Share profile */}
      <div className="flex items-center gap-5">
        <span className="text-sm font-normal text-gray-700">
          {t('CompanyDetail.shareProfile') || 'Share profile:'}
        </span>
        <div className="flex gap-2">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              onClick={() => onShare?.(platform.name)}
              className={`h-10 gap-3 border ${platform.color} hover:bg-gray-50`}
            >
              <span className="text-sm">{platform.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

