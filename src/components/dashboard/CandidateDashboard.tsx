'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { RecentApplications } from '@/components/dashboard/RecentApplications'
import { ProfileCompletionAlert } from '@/components/dashboard/ProfileCompletionAlert'
import { Briefcase, Bookmark, Bell } from 'lucide-react'

export function CandidateDashboard() {
  const stats = [
    {
      title: 'Applied Jobs',
      value: '589',
      icon: Briefcase,
      color: 'blue' as const,
      trend: '+12 this week',
    },
    {
      title: 'Favorite Jobs',
      value: '238',
      icon: Bookmark,
      color: 'yellow' as const,
      trend: '+5 this week',
    },
    {
      title: 'Job Alerts',
      value: '574',
      icon: Bell,
      color: 'green' as const,
      trend: '+3 this week',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      <ProfileCompletionAlert />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Recent Applications */}
      <RecentApplications />
    </div>
  )
}
