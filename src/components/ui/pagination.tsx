import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (p: number) => void
  showEdges?: boolean
  className?: string
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  showEdges: _showEdges = true,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const clamped = Math.min(Math.max(1, page), totalPages)

  const siblings = 1
  const start = Math.max(2, clamped - siblings)
  const end = Math.min(totalPages - 1, clamped + siblings)
  const pages = [1, ...range(start, end), totalPages].filter(
    (v, i, arr) => arr.indexOf(v) === i && v >= 1 && v <= totalPages
  )

  return (
    <nav
      className={cn(
        'flex items-center justify-center gap-1 text-sm',
        className
      )}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(clamped - 1)}
        disabled={clamped === 1}
        className={cn(
          'h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
        )}
        aria-label="Previous"
      >
        ‹
      </button>
      {pages.map((p, idx) => {
        const isActive = p === clamped
        const showEllipsis = idx > 0 && p - pages[idx - 1] > 1
        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className="px-1 text-gray-400">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'h-8 w-8 rounded-md border text-gray-600 transition',
                isActive
                  ? 'border-blue-600 bg-blue-600 font-semibold text-white'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              )}
            >
              {p}
            </button>
          </React.Fragment>
        )
      })}
      <button
        type="button"
        onClick={() => onPageChange(clamped + 1)}
        disabled={clamped === totalPages}
        className={cn(
          'h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
        )}
        aria-label="Next"
      >
        ›
      </button>
    </nav>
  )
}
