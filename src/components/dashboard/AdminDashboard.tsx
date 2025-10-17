'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { Users, Building, Briefcase, TrendingUp } from 'lucide-react'

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      icon: Users,
      color: 'blue' as const,
      trend: '+12% this month',
    },
    {
      title: 'Active Companies',
      value: '156',
      icon: Building,
      color: 'green' as const,
      trend: '+8 this week',
    },
    {
      title: 'Job Postings',
      value: '1,234',
      icon: Briefcase,
      color: 'purple' as const,
      trend: '+23% this month',
    },
    {
      title: 'Applications',
      value: '8,942',
      icon: TrendingUp,
      color: 'yellow' as const,
      trend: '+15% this month',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          System overview and management tools
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

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Manage Users
            </button>
            <button className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Review Companies
            </button>
            <button className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
              System Settings
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New user registration</span>
              <span className="text-gray-400">2m ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Company profile updated</span>
              <span className="text-gray-400">5m ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Job posting approved</span>
              <span className="text-gray-400">12m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
