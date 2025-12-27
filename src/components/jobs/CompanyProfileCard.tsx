'use client'

import { Separator } from '@/components/ui/separator'
import CalendarIcon from '@/assets/icons/calendar.svg'
import TimerIcon from '@/assets/icons/timer.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import BriefcaseIcon from '@/assets/icons/briefcase.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import EnvelopeIcon from '@/assets/icons/envelope.svg'
import FacebookIcon from '@/assets/icons/social-facebook.svg'
import TwitterIcon from '@/assets/icons/social-twitter.svg'
import InstagramIcon from '@/assets/icons/social-instagram.svg'
import YoutubeIcon from '@/assets/icons/social-youtube.svg'

export interface CompanyProfile {
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
    <div className="flex flex-col gap-6">
      {/* Company Profile Stats */}
      <div className="rounded-xl border-2 border-bg-blue-light bg-white p-6">
        <div className="flex flex-col gap-6">
          {/* First Row */}
          <div className="flex gap-6">
            <StatItem
              icon={CalendarIcon}
              label="Founded in:"
              value={company.foundedIn}
            />
            <StatItem
              icon={TimerIcon}
              label="Organization type"
              value={company.organizationType}
            />
          </div>
          {/* Second Row */}
          <div className="flex gap-6">
            <StatItem
              icon={WalletIcon}
              label="Team size"
              value={company.teamSize}
            />
            <StatItem
              icon={BriefcaseIcon}
              label="Industry types"
              value={company.industryTypes}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border-2 border-[rgba(206,224,245,0.70)] bg-white p-6">
        <h3 className="mb-4 text-xl font-medium text-text-dark">Contact Information</h3>
        <div className="flex flex-col gap-4">
          <ContactItem
            icon={GlobeIcon}
            label="Website"
            value={company.website}
            href={company.website !== 'N/A' ? `https://${company.website}` : undefined}
          />
          <Separator className="border-border-gray" />
          <ContactItem
            icon={PhoneIcon}
            label="Phone"
            value={company.phone}
          />
          <Separator className="border-border-gray" />
          <ContactItem
            icon={EnvelopeIcon}
            label="Email address"
            value={company.email}
          />
        </div>
      </div>

      {/* Follow us on */}
      <div className="rounded-xl border-2 border-[rgba(206,224,245,0.70)] bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-text-dark">Follow us on:</h3>
        <div className="flex gap-3">
          <SocialButton icon={FacebookIcon} bgColor="bg-blue-primary" />
          <SocialButton icon={TwitterIcon} bgColor="bg-white" />
          <SocialButton icon={InstagramIcon} bgColor="bg-white" />
          <SocialButton icon={YoutubeIcon} bgColor="bg-blue-primary" />
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Icon className="h-6 w-6" style={{ color: '#0a65cc' }} />
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal uppercase text-text-light-gray">{label}</p>
        <p className="text-sm font-medium text-text-dark">{value}</p>
      </div>
    </div>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-8 w-8 flex-shrink-0" style={{ color: '#0a65cc' }} />
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal uppercase text-text-light-gray">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-text-dark hover:text-blue-primary"
          >
            {value}
          </a>
        ) : (
          <p className="text-base font-medium text-text-dark">{value}</p>
        )}
      </div>
    </div>
  )
}

function SocialButton({ icon: Icon, bgColor }: { icon: any; bgColor: string }) {
  const iconColor = bgColor === 'bg-blue-primary' ? '#ffffff' : '#0a65cc'
  
  return (
    <button className={`flex h-10 w-10 items-center justify-center rounded ${bgColor} transition-colors hover:opacity-80`}>
      <Icon className="h-4 w-4" style={{ color: iconColor }} />
    </button>
  )
}