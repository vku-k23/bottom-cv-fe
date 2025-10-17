'use client'

import { Calendar, Clock, Briefcase, Globe, Phone, Mail } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export interface CompanyInfo {
  foundedIn: string
  organizationType: string
  teamSize: string
  industryType: string
  website: string
  phone: string
  email: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

interface CompanyInfoCardProps {
  info: CompanyInfo
}

export function CompanyInfoCard({ info }: CompanyInfoCardProps) {
  const { t } = useTranslation()

  const profileItems = [
    {
      icon: Calendar,
      label: t('CompanyDetail.foundedIn') || 'Founded in:',
      value: info.foundedIn,
    },
    {
      icon: Clock,
      label: t('CompanyDetail.organizationType') || 'Organization type',
      value: info.organizationType,
    },
    {
      icon: Briefcase,
      label: t('CompanyDetail.teamSize') || 'Team size',
      value: info.teamSize,
    },
    {
      icon: Briefcase,
      label: t('CompanyDetail.industryTypes') || 'Industry types',
      value: info.industryType,
    },
  ]

  const contactItems = [
    {
      icon: Globe,
      label: t('CompanyDetail.website') || 'Website',
      value: info.website,
      isLink: true,
    },
    {
      icon: Phone,
      label: t('CompanyDetail.phone') || 'Phone',
      value: info.phone,
    },
    {
      icon: Mail,
      label: t('CompanyDetail.emailAddress') || 'Email address',
      value: info.email,
      isLink: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Company Profile Card */}
      <div className="space-y-6 rounded-xl border-2 border-blue-50 bg-white p-8">
        {/* Profile Items in 2 columns */}
        <div className="grid grid-cols-2 gap-5">
          {profileItems.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="flex h-8 w-8 items-center justify-center">
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-normal text-gray-500 uppercase">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="space-y-4 rounded-xl border-2 border-blue-50 bg-white p-8">
        <h3 className="text-xl font-medium text-gray-900">
          {t('CompanyDetail.contactInformation') || 'Contact Information'}
        </h3>

        <div className="space-y-0">
          {contactItems.map((item, index) => (
            <div key={index}>
              <div className="flex gap-4 py-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-normal text-gray-500 uppercase">
                    {item.label}
                  </p>
                  {item.isLink ? (
                    <a
                      href={
                        item.icon === Mail ? `mailto:${item.value}` : item.value
                      }
                      className="text-base font-medium text-gray-900 hover:text-blue-600"
                      target={item.icon !== Mail ? '_blank' : undefined}
                      rel={
                        item.icon !== Mail ? 'noopener noreferrer' : undefined
                      }
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-base font-medium text-gray-900">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
              {index < contactItems.length - 1 && (
                <div className="h-px w-full bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Follow Us Card */}
      <div className="rounded-xl border-2 border-blue-50 bg-white p-8">
        <h3 className="text-lg font-medium text-gray-900">
          {t('CompanyDetail.followUsOn') || 'Follow us on:'}
        </h3>
        {/* TODO: Add social media icons */}
      </div>
    </div>
  )
}
