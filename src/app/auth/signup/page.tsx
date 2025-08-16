'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/auth_input'
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth'
import { SignupFormData } from '@/types/auth'
import { signupSchema } from '@/lib/validation'
import { toast } from 'react-hot-toast'

function SignUpForm() {
  const { register, isLoading } = useAuth()
  useRedirectIfAuthenticated()

  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    dayOfBirth: '', // yyyy-MM-dd from input
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({})

  const validateField = (name: string, value: string) => {
    const partial = { ...formData, [name]: value }
    const result = signupSchema.safeParse(partial)
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === name)
      if (fieldError) return fieldError.message
    }
    return ''
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = signupSchema.safeParse(formData)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof SignupFormData
        fieldErrors[key] = issue.message
      })
      setErrors(fieldErrors)
      toast.error('Please fix the highlighted errors')
      return
    }

    try {
      await register(formData)
    } catch (error) {
      console.error('Sign up error:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-black">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-gray-700">
              Join thousands of candidates and recruiters today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="md:col-span-1">
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="yourusername"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Min 6 chars: Az0@1 pattern
                </p>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="phoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="0123456789"
                  autoComplete="tel"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="dayOfBirth"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Date of birth
                </label>
                <Input
                  id="dayOfBirth"
                  name="dayOfBirth"
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dayOfBirth}
                  onChange={handleInputChange}
                />
                {errors.dayOfBirth && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.dayOfBirth}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-gray-50 p-3 md:col-span-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-xs text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
              <div className="text-center text-sm text-gray-600 md:col-span-2">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  )
}
