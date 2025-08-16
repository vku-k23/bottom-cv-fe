import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        `border-input bg-background ring-offset-background peer flex h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
