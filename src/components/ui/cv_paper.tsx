import * as React from 'react'
import { cn } from '@/lib/utils'

const Paper = React.forwardRef<
    HTMLDivElement,
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('shadow-2xl w-auto h-370', className)}
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
    <div
        ref={ref}
        className={cn('flex-shrink-0', className)}
        {...props}
    />
))
ProfileImg.displayName = 'ProfileImg'

const VerticalLine = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('w-0.5 h-70 bg-black', className)}
        {...props}
    />
))
VerticalLine.displayName = 'VerticalLine'

const HorizontalLine = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('h-0.5 bg-black mx-auto w-225', className)}
        {...props}
    />
))
HorizontalLine.displayName = 'HorizontalLine'

export {Paper, ProfileImg, PaperHeader, VerticalLine, HorizontalLine}