'use client'

import { useAuthStore } from '@/stores/authStore'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentApplications } from '@/components/dashboard/RecentApplications'
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react'

export function EmployerDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: 'Active Jobs',
      value: '12',
      icon: Briefcase,
      color: 'blue' as const,
      trend: '+2 this week',
    },
    {
      title: 'Total Applicants',
      value: '342',
      icon: Users,
      color: 'green' as const,
      trend: '+18% this month',
    },
    {
      title: 'Interviews',
      value: '27',
      icon: Calendar,
      color: 'purple' as const,
      trend: '+5 this week',
    },
    {
      title: 'Hires',
      value: '6',
      icon: TrendingUp,
      color: 'yellow' as const,
      trend: '+1 this month',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.profile?.firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here&apos;s what&apos;s happening with your job postings and
          applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
