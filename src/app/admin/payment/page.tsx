'use client'

import { PricingCard } from '@/components/pricing/PricingCard'
import { pricingPlans } from '@/data/pricingPlans'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import { paymentService } from '@/lib/paymentService'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PaymentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  // Get employer's company ID
  const companyId = (user as { company?: { id: number } })?.company?.id

  const createSessionMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!companyId) {
        throw new Error('Company ID is required. Please set up your company profile first.')
      }

      // Map plan ID to plan type
      const planTypeMap: Record<string, 'BASIC' | 'STANDARD' | 'PREMIUM'> = {
        basic: 'BASIC',
        standard: 'STANDARD',
        premium: 'PREMIUM',
      }

      const planType = planTypeMap[planId.toLowerCase()]
      if (!planType) {
        throw new Error('Invalid plan selected')
      }

      setIsProcessing(true)
      const response = await paymentService.createCheckoutSession(planType, companyId)

      console.log('Payment response:', response)

      if (response && response.checkoutSessionUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.checkoutSessionUrl
      } else {
        console.error('Invalid response from payment service:', response)
        throw new Error('Failed to create checkout session. Please try again.')
      }
    },
    onError: (error: unknown) => {
      console.log(error)
      setIsProcessing(false)
      const message = error instanceof Error ? error.message : 'Failed to create checkout session'
      toast.error(message)
    },
  })

  const handleSelectPlan = (planId: string) => {
    if (!companyId) {
      toast.error('Please set up your company profile first')
      router.push('/admin/company-profile')
      return
    }

    createSessionMutation.mutate(planId)
  }

  if (!companyId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Company Profile Required
            </h2>
            <p className="mb-6 text-gray-600">
              You need to set up your company profile before subscribing.
            </p>
            <button
              onClick={() => router.push('/admin/company-profile')}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Company Profile
            </button>
          </div>
        </div>
      </div>
    )
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
            Choose a subscription plan that fits your hiring needs. All plans include
            access to our candidate database and job posting features.
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

      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 text-center">
            <div className="mb-4 text-lg font-semibold">Processing...</div>
            <div className="text-sm text-gray-600">
              Redirecting to payment page...
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-8 text-center">
        <p className="text-text-gray text-sm font-normal">
          @ 2024 MyJob - Job Portal. All rights Reserved
        </p>
      </div>
    </div>
  )
}
