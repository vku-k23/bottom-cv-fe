'use client'

import { Calendar, Clock, Briefcase, DollarSign, MapPin } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export interface JobOverview {
  datePosted: string
  expirationDate: string
  education: string
  salary: string
  location: string
  jobType: string
  experience: string
}

interface JobOverviewCardProps {
  overview: JobOverview
}

export function JobOverviewCard({ overview }: JobOverviewCardProps) {
  const { t } = useTranslation()

  const overviewItems = [
    {
      icon: Calendar,
      label: t('JobDetail.jobPosted') || 'Job Posted:',
      value: overview.datePosted,
    },
    {
      icon: Clock,
      label: t('JobDetail.jobExpireIn') || 'Job expire in:',
      value: overview.expirationDate,
    },
    {
      icon: Briefcase,
      label: t('JobDetail.education') || 'Education',
      value: overview.education,
    },
    {
      icon: DollarSign,
      label: t('JobDetail.salary') || 'Salary:',
      value: overview.salary,
    },
    {
      icon: MapPin,
      label: t('JobDetail.location') || 'Location:',
      value: overview.location,
    },
    {
      icon: Briefcase,
      label: t('JobDetail.jobType') || 'Job type:',
      value: overview.jobType,
    },
    {
      icon: Briefcase,
      label: t('JobDetail.experience') || 'Experience',
      value: overview.experience,
    },
  ]

  return (
    <div className="space-y-6 rounded-lg border-2 border-blue-50 bg-white p-8">
      <h3 className="text-xl font-medium text-gray-900">
        {t('JobDetail.jobOverview') || 'Job Overview'}
      </h3>

      <div className="space-y-5">
        {/* First row */}
        <div className="grid grid-cols-2 gap-5">
          {overviewItems.slice(0, 2).map((item, index) => (
            <OverviewItem key={index} {...item} />
          ))}
          {overviewItems.slice(2, 3).map((item, index) => (
            <OverviewItem key={index + 2} {...item} />
          ))}
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 gap-5">
          {overviewItems.slice(3, 6).map((item, index) => (
            <OverviewItem key={index + 3} {...item} />
          ))}
        </div>

        {/* Third row */}
        <div className="grid grid-cols-2 gap-5">
          {overviewItems.slice(6, 7).map((item, index) => (
            <OverviewItem key={index + 6} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface OverviewItemProps {
  icon: React.ElementType
  label: string
  value: string
}

function OverviewItem({ icon: Icon, label, value }: OverviewItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

