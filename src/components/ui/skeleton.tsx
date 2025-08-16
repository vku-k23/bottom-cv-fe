import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton rounded-md',
        !shimmer && 'animate-none',
        className
      )}
      aria-hidden
      {...props}
    />
  )
}
