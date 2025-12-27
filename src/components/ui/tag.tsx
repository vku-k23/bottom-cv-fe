import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'default' | 'blue' | 'green' | 'indigo' | 'amber' | 'red'
  size?: 'sm' | 'md'
  interactive?: boolean
  selected?: boolean
}

const colorMap: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  green: 'bg-green-50 text-green-700 hover:bg-green-100',
  indigo: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
}

const sizeMap = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      color = 'default',
      size = 'md',
      interactive,
      selected,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        data-selected={selected || undefined}
        className={cn(
          'inline-flex items-center rounded-full border border-transparent font-medium transition-colors',
          colorMap[color],
          sizeMap[size],
          interactive && 'cursor-pointer select-none',
          selected && 'ring-2 ring-blue-500 ring-offset-1',
          className
        )}
        {...props}
      />
    )
  }
)
Tag.displayName = 'Tag'
