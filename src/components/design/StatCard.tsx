import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: string
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-gray-500">{label}</div>
          <div className="mt-2 text-2xl font-bold text-black">{value}</div>
          {trend && <div className="mt-1 text-xs text-green-600">{trend}</div>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  )
}
