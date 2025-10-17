'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/hooks/useTranslation'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:h-[calc(100vh-6rem)] lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Auth.checkYourEmail')}</CardTitle>
              <CardDescription>
                {t('Auth.weHaveSentAPasswordResetLinkToYourEmailAddress')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  {t('Auth.ifYouDontSeeTheEmailCheckYourSpamFolder')}
                </p>
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('Auth.backToSignIn')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:h-[calc(100vh-6rem)] lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('Auth.forgotPassword')}</CardTitle>
            <CardDescription>
              {t('Auth.weWillSendYouALinkToResetYourPassword')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Auth.emailAddress')}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? t('Auth.sending') : t('Auth.sendResetLink')}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('Auth.rememberYourPassword')}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('Auth.signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
