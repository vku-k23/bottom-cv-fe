'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { SignupFormData } from '@/types/auth'
import { useTranslation } from 'react-i18next'

export default function SignUpPage() {
  const { register, isLoading } = useAuth()
  const { t } = useTranslation()
  useRedirectIfAuthenticated()

  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    dayOfBirth: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }
    if (!formData.dayOfBirth) {
      newErrors.dayOfBirth = 'Date of birth is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms of Services'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await register(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
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
        <div className="flex w-full items-center justify-center px-8 py-2 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-gray-900">
                  {t('Auth.signUpTitle')}
                </h1>
                <div className="text-sm">
                  <span className="text-gray-600">
                    {t('Auth.alreadyHaveAnAccount')}
                  </span>
                  <Link
                    href="/auth/signin"
                    className="ml-1 font-medium text-blue-600"
                  >
                    {t('Auth.signIn')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name and Last Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('Auth.firstName')}
                    className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('Auth.lastName')}
                    className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

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
                  className={`h-12 ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('Auth.emailAddress')}
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t('Auth.phoneNumber')}
                    className={`h-12 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <Input
                    id="dayOfBirth"
                    name="dayOfBirth"
                    type="date"
                    required
                    value={formData.dayOfBirth}
                    onChange={handleInputChange}
                    placeholder={t('Auth.dayOfBirth')}
                    className={`h-12 ${errors.dayOfBirth ? 'border-red-500' : ''}`}
                  />
                  {errors.dayOfBirth && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.dayOfBirth}
                    </p>
                  )}
                </div>
              </div>
              {/* Password */}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('Auth.password')}
                  className={`h-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('Auth.confirmPassword')}
                  className={`h-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showConfirmPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    )}
                  </svg>
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked)
                      if (errors.terms) {
                        setErrors((prev) => ({
                          ...prev,
                          terms: '',
                        }))
                      }
                    }}
                    className={`h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${errors.terms ? 'border-red-500' : ''}`}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t('Auth.iVeReadAndAgreeWithYourTermsOfServices')}
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-blue-600 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {isLoading ? 'Creating account...' : 'Create account'}
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
                <span className="text-sm text-gray-500">or</span>
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
                  <span className="text-sm">Sign up with Facebook</span>
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
                  <span className="text-sm">Sign up with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
