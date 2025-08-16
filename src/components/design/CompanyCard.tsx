import * as React from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface CompanyCardProps {
  id: string | number
  name: string
  logoUrl?: string | null
  location?: string
  industry?: string
  openings?: number
  description?: string
  compact?: boolean
  className?: string
}

export function CompanyCard({
  id,
  name,
  logoUrl,
  location,
  industry,
  openings,
  description,
  compact,
  className,
}: CompanyCardProps) {
  return (
    <div
      className={cn(
        'group relative flex gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md',
        className
      )}
    >
      <Avatar
        src={logoUrl || undefined}
        fallback={name[0]}
        size={compact ? 'sm' : 'md'}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/companies/${id}`}
              className="block font-semibold text-black hover:text-blue-600"
            >
              {name}
            </Link>
            {(location || industry) && (
              <div className="mt-1 text-xs text-gray-500">
                {location}
                {location && industry && ' • '}
                {industry}
              </div>
            )}
          </div>
          {typeof openings === 'number' && (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
              {openings} {openings === 1 ? 'Opening' : 'Openings'}
            </span>
          )}
        </div>
        {description && !compact && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-600">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
