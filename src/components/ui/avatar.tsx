import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'full' | 'md'
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt, fallback, size = 'md', rounded = 'full', ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-gray-200 font-medium text-gray-700',
          sizeMap[size],
          rounded === 'full' ? 'rounded-full' : 'rounded-md',
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          fallback?.slice(0, 2).toUpperCase()
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
