'use client'

import CalendarIcon from '@/assets/icons/calendar.svg'
import TimerIcon from '@/assets/icons/timer.svg'
import BriefcaseIcon from '@/assets/icons/briefcase.svg'
import WalletIcon from '@/assets/icons/wallet.svg'
import MapPinIcon from '@/assets/icons/map-pin.svg'

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
  return (
    <div className="border-bg-blue-light rounded-lg border-2 bg-white p-8">
      <h3 className="text-text-dark mb-6 text-xl font-medium">Job Overview</h3>

      <div className="flex flex-col gap-6">
        {/* First Row - 3 columns */}
        <div className="flex gap-6">
          <OverviewItem
            icon={CalendarIcon}
            label="Job Posted:"
            value={overview.datePosted}
          />
          <OverviewItem
            icon={TimerIcon}
            label="Job expire in:"
            value={overview.expirationDate}
          />
          <OverviewItem
            icon={BriefcaseIcon}
            label="Education"
            value={overview.education}
          />
        </div>

        {/* Second Row - 3 columns */}
        <div className="flex gap-6">
          <OverviewItem
            icon={WalletIcon}
            label="Salery:"
            value={overview.salary}
          />
          <OverviewItem
            icon={MapPinIcon}
            label="LOCATIOn:"
            value={overview.location}
          />
          <OverviewItem
            icon={BriefcaseIcon}
            label="job type:"
            value={overview.jobType}
          />
        </div>

        {/* Third Row - Single item */}
        <div className="flex">
          <OverviewItem
            icon={BriefcaseIcon}
            label="Experience"
            value={overview.experience}
          />
        </div>
      </div>
    </div>
  )
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-1 gap-4">
      <Icon className="h-6 w-6 flex-shrink-0" style={{ color: '#0a65cc' }} />
      <div className="flex flex-col gap-1">
        <p className="text-text-light-gray text-xs font-normal uppercase">
          {label}
        </p>
        <p className="text-text-dark text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
