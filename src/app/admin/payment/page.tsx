'use client'

import { PricingCard } from '@/components/pricing/PricingCard'
import { pricingPlans } from '@/data/pricingPlans'
import Image from 'next/image'

export default function PaymentPage() {
  const handleSelectPlan = (planId: string) => {
    // Handle plan selection - could navigate to checkout or show modal
    console.log('Selected plan:', planId)
    // router.push(`/admin/checkout?plan=${planId}`)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-34">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-text-dark text-2xl font-medium lg:text-3xl">
            Buy Premium Subscription to Post a Job
          </h1>
          <p className="text-text-gray text-base leading-6 font-normal">
            Donec eu dui ut dolor commodo ornare. Sed arcu libero, malesuada
            quis justo sit amet, varius tempus neque. Quisque ultrices mi sed
            lorem condimentum, vel tempus lectus ultricies.
          </p>
        </div>

        <div className="w-full max-w-xs lg:max-w-md">
          <Image
            src="/images/pricing/status-update-illustration.svg"
            alt="Job posting illustration"
            width={312}
            height={256}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="pt-8 text-center">
        <p className="text-text-gray text-sm font-normal">
          @ 2024 MyJob - Job Portal. All rights Reserved
        </p>
      </div>
    </div>
  )
}
