'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { FC, SVGProps } from 'react'
import FacebookIcon from '@/assets/icons/social-facebook.svg'
import TwitterIcon from '@/assets/icons/social-twitter.svg'
import InstagramIcon from '@/assets/icons/social-instagram.svg'
import YoutubeIcon from '@/assets/icons/social-youtube.svg'

export interface CompanyProfile {
  id?: string
  name: string
  logo?: string
  description: string
  foundedIn: string
  organizationType: string
  companySize: string
  teamSize: string
  industryTypes: string
  phone: string
  email: string
  website: string
  socialLinks?: Record<string, string>
}

interface CompanyProfileCardProps {
  company: CompanyProfile
}

export function CompanyProfileCard({ company }: CompanyProfileCardProps) {
  return (
    <div className="border-bg-blue-light rounded-xl border-2 bg-white p-8">
      {/* Company Header */}
      <div className="mb-8 flex items-center gap-4">
        {company.logo && (
          <Image
            src={company.logo}
            alt={company.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover"
          />
        )}
        <div>
          {company.id ? (
            <Link href={`/companies/${company.id}`}>
              <h3 className="text-text-dark hover:text-blue-primary cursor-pointer text-xl font-medium transition-colors">
                {company.name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-text-dark text-xl font-medium">
              {company.name}
            </h3>
          )}
          <p className="text-text-light-gray text-sm font-normal">
            {company.description}
          </p>
        </div>
      </div>

      {/* Company Info List */}
      <div className="flex flex-col gap-4">
        <InfoRow label="Founded in:" value={company.foundedIn} />
        <InfoRow label="Organization type:" value={company.organizationType} />
        <InfoRow label="Company size:" value={company.companySize} />
        <InfoRow label="Phone:" value={company.phone} />
        <InfoRow label="Email:" value={company.email} />
        <InfoRow label="Website:" value={company.website} isLink />
      </div>

      {/* Social Media Icons */}
      <div className="mt-6 flex gap-2">
        <SocialButton icon={FacebookIcon} bgColor="#0a65cc" />
        <SocialButton icon={TwitterIcon} bgColor="#0a65cc" />
        <SocialButton icon={InstagramIcon} bgColor="transparent" />
        <SocialButton icon={YoutubeIcon} bgColor="#0a65cc" />
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  isLink = false,
}: {
  label: string
  value: string
  isLink?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-gray text-base font-normal">{label}</span>
      {isLink && value !== 'N/A' ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-dark hover:text-blue-primary line-clamp-1 text-base font-normal"
        >
          {value}
        </a>
      ) : (
        <span className="text-text-dark text-base font-normal">{value}</span>
      )}
    </div>
  )
}

function SocialButton({
  icon: Icon,
  bgColor,
}: {
  icon: FC<SVGProps<SVGElement>>
  bgColor: string
}) {
  const isTransparent = bgColor === 'transparent'
  const iconColor = isTransparent ? '#0a65cc' : '#ffffff'

  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded transition-colors hover:opacity-80 ${
        isTransparent ? 'bg-transparent' : ''
      }`}
      style={!isTransparent ? { backgroundColor: bgColor } : {}}
    >
      <Icon className="h-4 w-4" style={{ color: iconColor }} />
    </button>
  )
}
