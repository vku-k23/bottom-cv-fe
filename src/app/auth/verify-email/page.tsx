'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { toast } from 'react-hot-toast'

function VerifyEmailInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        toast.error('Missing token')
        return
      }
      try {
        await apiClient.get(
          `${API_ENDPOINTS.auth.verifyEmail}?token=${encodeURIComponent(token)}`
        )
        setStatus('success')
        toast.success('Email verified. You can now sign in.')
        setTimeout(() => router.push('/auth/signin'), 1500)
      } catch (e) {
        setStatus('error')
        const msg = e instanceof Error ? e.message : 'Verification failed'
        toast.error(msg)
      }
    }
    verify()
  }, [token, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="text-center">
        {status === 'loading' && (
          <p className="text-sm text-gray-700">Verifying email...</p>
        )}
        {status === 'success' && (
          <p className="text-sm font-medium text-green-600">
            Email verified! Redirecting...
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm font-medium text-red-600">
            Verification failed.
          </p>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  )
}
