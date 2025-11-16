'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export interface CompanyProfile {
  name: string
  logo?: string
  description: string
  foundedIn: string
  organizationType: string
  companySize: string
  phone: string
  email: string
  website: string
}

interface CompanyProfileCardProps {
  company: CompanyProfile
}

export function CompanyProfileCard({ company }: CompanyProfileCardProps) {
  const { t } = useTranslation()

  const companyDetails = [
    {
      label: t('JobDetail.foundedIn') || 'Founded in:',
      value: company.foundedIn,
    },
    {
      label: t('JobDetail.organizationType') || 'Organization type:',
      value: company.organizationType,
    },
    {
      label: t('JobDetail.companySize') || 'Company size:',
      value: company.companySize,
    },
    {
      label: t('JobDetail.phone') || 'Phone:',
      value: company.phone,
    },
    {
      label: t('JobDetail.email') || 'Email:',
      value: company.email,
    },
    {
      label: t('JobDetail.website') || 'Website:',
      value: company.website,
    },
  ]

  return (
    <div className="space-y-8 rounded-xl border-2 border-blue-50 p-8">
      {/* Company Header */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-white">
              {company.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Company Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium text-gray-900">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.description}</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-4">
        {companyDetails.map((detail, index) => (
          <div key={index} className="flex items-center justify-between gap-8">
            <span className="text-base text-gray-600">{detail.label}</span>
            <span className="text-base font-normal text-gray-900">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Social Media - Placeholder */}
      <div className="h-px w-full bg-gray-200" />
    </div>
  )
}
