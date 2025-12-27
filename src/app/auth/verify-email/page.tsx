'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { apiClient, API_ENDPOINTS } from '@/lib/api'

function VerifyEmailContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setErrorMessage(t('Auth.invalidToken'))
        return
      }

      try {
        await apiClient.get(`${API_ENDPOINTS.auth.verifyEmail}?token=${token}`)
        setStatus('success')
      } catch (error) {
        setStatus('error')
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage(t('Auth.verificationFailed'))
        }
      }
    }

    verifyEmail()
  }, [token, t])

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {t('Auth.verifyingEmail')}
                </h2>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {t('Auth.verificationSuccess')}
                </h2>
                <div className="mt-6">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    {t('Auth.backToLogin')}
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
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
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  {t('Auth.verificationFailed')}
                </h2>
                <p className="mb-6 text-gray-600">{errorMessage}</p>
                <div>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    {t('Auth.backToLogin')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
