'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { Input } from '@/components/ui/input'
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { LoginFormData } from '@/types/auth'

export default function SignInPage() {
  const { t } = useTranslation()
  const { login, isLoading } = useAuth()
  useRedirectIfAuthenticated()

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]">
      <div className="flex h-full">
        {/* Left side - Image and stats */}
        <div className="relative hidden lg:flex lg:w-1/2">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/auth/signup.png)' }}
          ></div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-gray-900">
                  {t('Auth.signInTitle')}
                </h1>
                <div className="text-sm">
                  <span className="text-gray-600">
                    {t('Auth.dontHaveAccount')}
                  </span>
                  <Link
                    href="/auth/signup"
                    className="ml-1 font-medium text-blue-600"
                  >
                    {t('Auth.signUp')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={t('Auth.username')}
                  className="h-12"
                />
              </div>

              {/* Password */}
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('Auth.password')}
                  className="h-12"
                />
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {t('Auth.rememberMe')}
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    {t('Auth.forgotPassword')}
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-blue-600 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {isLoading ? t('Auth.signingIn') : t('Auth.signIn')}
                </span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-gray-500">{t('Auth.or')}</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center space-x-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm">
                    {t('Auth.signInWithFacebook')}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex h-12 items-center justify-center space-x-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm">{t('Auth.signInWithGoogle')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
