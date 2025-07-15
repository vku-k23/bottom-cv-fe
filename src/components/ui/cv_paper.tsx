import * as React from 'react'
import { cn } from '@/lib/utils'

const Paper = React.forwardRef<
    HTMLDivElement,
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('container mx-auto shadow-2xl w-auto h-520 sm:h-470 md:h-420 lg:h-370', className)}
        {...props}
    />
))
Paper.displayName = 'Paper'

const PaperHeader = React.forwardRef<
    HTMLDivElement,
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
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
>(({ className,...props }, ref) => (
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
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('w-0.5 bg-black', className)}
        {...props}
    />
))
VerticalLine.displayName = 'VerticalLine'

const HorizontalLine = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('h-0.5 bg-black mx-auto w-5/6 sm:w-7/8 md:w-8/9 lg:w-225', className)}
        {...props}
    />
))
HorizontalLine.displayName = 'HorizontalLine'

const ContactContent = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex min-w-0 flex-col sm:flex-row sm:space-x-6 items-start sm:items-center mx-1 sm:mx-2 md:mx-3 lg:mx-4 mt-4 sm:mt-5 md:mt-6 lg:mt-7', className)}
        {...props}
    />
))
ContactContent.displayName = 'ContactContent'

const ProfileInfoDiv = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('w-5/6 sm:w-7/8 md:w-8/9 lg:w-225 h-80 sm:h-70 md:h-60 lg:h-50 mx-auto mt-4 sm:mt-5 md:mt-6 lg:mt-7 mb-45 sm:mb-30 md:mb-10 lg:mb-5', className)}
        {...props}
    />
))
ProfileInfoDiv.displayName = 'ProfileInfoDiv'

const AbilityInfoDiv = React.forwardRef<
    HTMLDivElement, 
    React.AllHTMLAttributes<HTMLDivElement>
>(({ className,...props }, ref) => (
    <div
        ref={ref}
        className={cn('w-5/6 sm:w-7/8 md:w-8/9 lg:w-225 h-50 mx-auto mt-4 sm:mt-5 md:mt-6 lg:mt-7 mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex', className)}
        {...props}
    />
))
AbilityInfoDiv.displayName = 'AbilityInfoDiv'

export {
    Paper, 
    ProfileImg, 
    PaperHeader, 
    VerticalLine, 
    HorizontalLine, 
    ContactContent,
    ProfileInfoDiv,
    AbilityInfoDiv
}