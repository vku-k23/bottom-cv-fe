import * as React from 'react'

import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        `absolute -top-3 left-3 mb-1 block bg-gray-50 px-1 text-sm font-medium transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-gray-900`,
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
})
Label.displayName = 'Label'
export { Label }
