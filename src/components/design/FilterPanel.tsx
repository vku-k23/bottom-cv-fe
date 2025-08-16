import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterSection {
  id: string
  title: string
  type: 'checkbox' | 'radio'
  options: FilterOption[]
  limit?: number
}

export interface FilterPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  keyword?: string
  onKeywordChange?: (v: string) => void
  sections: FilterSection[]
  values: Record<string, string[]>
  onSectionChange: (sectionId: string, next: string[]) => void
  onReset?: () => void
  footer?: React.ReactNode
}

export function FilterPanel({
  keyword,
  onKeywordChange,
  sections,
  values,
  onSectionChange,
  onReset,
  footer,
  className,
  ...props
}: FilterPanelProps) {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
        className
      )}
      {...props}
    >
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-700">
        Filters
      </h2>
      <div className="space-y-6 text-sm text-gray-600">
        {typeof keyword !== 'undefined' && (
          <div>
            <label className="mb-1 block font-medium text-gray-700">
              Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange?.(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              placeholder="Search..."
            />
          </div>
        )}
        {sections.map((s) => {
          const selected = values[s.id] || []
          return (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between">
                <label className="block font-medium text-gray-700">
                  {s.title}
                </label>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSectionChange(s.id, [])}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {s.options.slice(0, s.limit || s.options.length).map((opt) => {
                  const active = selected.includes(opt.value)
                  return (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type={s.type === 'radio' ? 'radio' : 'checkbox'}
                        name={s.id}
                        checked={active}
                        onChange={() => {
                          if (s.type === 'radio') {
                            onSectionChange(s.id, [opt.value])
                          } else {
                            onSectionChange(
                              s.id,
                              active
                                ? selected.filter((v) => v !== opt.value)
                                : [...selected, opt.value]
                            )
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              /* live filtering externally */
            }}
            className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
        {footer}
      </div>
    </div>
  )
}
