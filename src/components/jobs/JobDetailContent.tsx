'use client'

import { Button } from '@/components/ui/button'
import FacebookIcon from '@/assets/icons/facebook.svg'
import TwitterIcon from '@/assets/icons/twitter.svg'
import PinterestIcon from '@/assets/icons/pinterest.svg'

export interface JobContent {
  description: string
  responsibilities: string[]
}

interface JobDetailContentProps {
  content: JobContent
  onShare?: (platform: string) => void
}

export function JobDetailContent({ content, onShare }: JobDetailContentProps) {
  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: FacebookIcon,
      textColor: '#0a65cc',
    },
    {
      name: 'Facebook',
      icon: TwitterIcon,
      textColor: '#1da1f2',
    },
    {
      name: 'Pinterest',
      icon: PinterestIcon,
      textColor: '#ca2127',
    },
  ]

  // Parse description into paragraphs
  const descriptionParagraphs = content.description
    .split('\n')
    .filter((p) => p.trim())

  return (
    <div className="flex flex-col gap-8">
      {/* Job Description */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-black">Job Description</h2>
        <div className="flex flex-col gap-4">
          {descriptionParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-text-gray text-base leading-6 font-normal"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      {content.responsibilities.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-black">Responsibilities</h2>
          <div className="flex flex-col gap-4">
            {content.responsibilities.map((item, index) => (
              <p key={index} className="text-text-gray text-base font-normal">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Share this job */}
      <div className="flex items-center gap-5">
        <span className="text-text-gray text-base font-normal">
          Share this job:
        </span>
        <div className="flex gap-3">
          {socialPlatforms.map((platform, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => onShare?.(platform.name)}
              className="flex h-11 items-center gap-3 rounded border border-[#cee0f5] px-3"
            >
              <platform.icon
                className="h-5 w-5"
                style={{ color: platform.textColor }}
              />
              <span
                className="text-sm font-normal"
                style={{ color: platform.textColor }}
              >
                {platform.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
