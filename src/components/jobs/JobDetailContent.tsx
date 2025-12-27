'use client'

import { Button } from '@/components/ui/button'
import FacebookIcon from '@/assets/icons/facebook.svg'
import TwitterIcon from '@/assets/icons/twitter.svg'
import PinterestIcon from '@/assets/icons/pinterest.svg'

export interface JobContent {
  description: string
  benefits: string
  vision: string
}

interface JobDetailContentProps {
  content: JobContent
  onShare?: (platform: string) => void
}

export function JobDetailContent({ content, onShare }: JobDetailContentProps) {
  const socialPlatforms = [
    { name: 'Facebook', icon: FacebookIcon, borderColor: 'border-transparent', textColor: 'text-facebook' },
    { name: 'Facebook', icon: TwitterIcon, borderColor: 'border-transparent', textColor: 'text-twitter' },
    { name: 'Pinterest', icon: PinterestIcon, borderColor: 'border-transparent', textColor: 'text-pinterest' },
  ]

  // Parse description into paragraphs
  const descriptionParagraphs = content.description.split('\n').filter(p => p.trim())
  
  // Parse benefits into list items
  const benefitItems = content.benefits ? content.benefits.split('\n').filter(b => b.trim()) : []

  return (
    <div className="flex flex-col gap-9">
      {/* Job Description */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium text-text-dark">Description</h2>
        <div className="flex flex-col gap-4">
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className="text-base font-normal leading-6 text-text-gray">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Company Benefits */}
      {benefitItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-text-dark">Company Benefits</h2>
          <div className="flex flex-col gap-3">
            <p className="text-base font-normal leading-6 text-text-gray">
              {benefitItems[0]}
            </p>
            <ul className="flex flex-col gap-3">
              {benefitItems.slice(1).map((item, index) => (
                <li key={index} className="text-base font-normal text-text-gray">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Company Vision */}
      {content.vision && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-text-dark">Company Vision</h2>
          <p className="text-base font-normal leading-6 text-text-gray">
            {content.vision}
          </p>
        </div>
      )}

      {/* Share this job */}
      <div className="flex items-center gap-5">
        <span className="text-sm font-normal text-[#474c54]">Share profile:</span>
        <div className="flex gap-3">
          {socialPlatforms.map((platform, idx) => (
            <Button
              key={idx}
              variant="outline"
              onClick={() => onShare?.(platform.name)}
              className={`flex h-12 items-center gap-3 rounded border ${platform.borderColor} px-3`}
            >
              <platform.icon className="h-5 w-5" style={{ color: platform.textColor.replace('text-', '') === 'facebook' ? '#0066ff' : platform.textColor.replace('text-', '') === 'twitter' ? '#1da1f2' : '#ca2127' }} />
              <span className={`text-sm font-normal ${platform.textColor}`}>
                {platform.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}