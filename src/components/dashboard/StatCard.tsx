'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  trend?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${colors.bg}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-gray-500">{trend}</p>}
        </div>
        <div className={`rounded-lg p-3 ${colors.iconBg}`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}
