import * as React from 'react'
import { cn } from '@/lib/utils'

const Paper = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h-370 w-auto shadow-2xl', className)}
    {...props}
  />
))
Paper.displayName = 'Paper'

const PaperHeader = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center space-x-15 px-20 pt-15 pb-5', className)}
    {...props}
  />
))
PaperHeader.displayName = 'PaperHeader'

const ProfileImg = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-shrink-0', className)} {...props} />
))
ProfileImg.displayName = 'ProfileImg'

const VerticalLine = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('h-70 w-0.5 bg-black', className)} {...props} />
))
VerticalLine.displayName = 'VerticalLine'

const HorizontalLine = React.forwardRef<
  HTMLDivElement,
  React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mx-auto h-0.5 w-225 bg-black', className)}
    {...props}
  />
))
HorizontalLine.displayName = 'HorizontalLine'

export { Paper, ProfileImg, PaperHeader, VerticalLine, HorizontalLine }
