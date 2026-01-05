'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { paymentService } from '@/lib/paymentService'
import { toast } from 'react-hot-toast'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      toast.error('Invalid payment session. Please try again.')
      router.push('/admin/payment')
      return
    }

    // Verify session with backend
    const verifySession = async () => {
      try {
        setIsVerifying(true)
        const response = await paymentService.verifySession(sessionId)

        if (response.status === 'PAID') {
          setIsVerified(true)
          toast.success('Payment successful! Your subscription is now active.')
          // Redirect to jobs page after a short delay
          setTimeout(() => {
            router.push('/admin/jobs')
          }, 3000)
        } else {
          toast.error('Payment verification failed. Please contact support.')
          setTimeout(() => {
            router.push('/admin/payment')
          }, 3000)
        }
      } catch (error) {
        console.error('Error verifying session:', error)
        toast.error('Failed to verify payment. Please contact support.')
        setTimeout(() => {
          router.push('/admin/payment')
        }, 3000)
      } finally {
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [searchParams, router])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {isVerifying ? (
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment with Stripe.
            </p>
          </div>
        ) : isVerified ? (
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mb-6 text-gray-600">
              Your subscription has been activated. You can now create jobs and
              access all premium features.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to jobs page...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Verification Failed
            </h2>
            <p className="mb-6 text-gray-600">
              We couldn&apos;t verify your payment. Please contact support if you
              have been charged.
            </p>
            <button
              onClick={() => router.push('/admin/payment')}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

