'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to dashboard or home based on user role
      if (
        user?.roles?.some((r) => r.name === 'ADMIN' || r.name === 'EMPLOYER')
      ) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">403</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Access Forbidden
        </h2>
        <p className="mb-8 text-gray-600">
          You don&apos;t have permission to access this resource.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleGoBack} variant="outline">
            Go Back
          </Button>
          {user?.roles?.some(
            (r) => r.name === 'ADMIN' || r.name === 'EMPLOYER'
          ) ? (
            <Link href="/admin">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
