'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function PaymentCancelPage() {
  const router = useRouter()

  useEffect(() => {
    toast.error('Payment was cancelled. Please try again if you want to subscribe.')
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            Payment Cancelled
          </h2>
          <p className="mb-6 text-gray-600">
            Your payment was cancelled. No charges have been made to your
            account.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/admin/payment')}
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/admin/jobs')}
              className="rounded border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
            >
              Go to Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

