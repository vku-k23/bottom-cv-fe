'use client'

import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { EmployerSidebar } from '@/components/employer/EmployerSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminFooter } from '@/components/admin/AdminFooter'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const { fetchCurrentUser, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isLoading) return

      // If authenticated but user not loaded, fetch it
      if (isAuthenticated && !user) {
        try {
          await fetchCurrentUser()
          setIsChecking(false)
          return
        } catch (error) {
          console.error('Failed to fetch user:', error)
          router.push('/403')
          return
        }
      }

      // If user is not loaded, wait
      if (!user) {
        setIsChecking(false)
        return
      }

      // Debug logging
      console.log('Admin Layout - User:', user)
      console.log('Admin Layout - Roles:', user?.roles)
      console.log(
        'Admin Layout - Role names:',
        user?.roles?.map((r) => r.name)
      )

      // Check if user has ADMIN or EMPLOYER role
      const hasAdminAccess = user?.roles?.some((role) => {
        const roleName =
          typeof role.name === 'string'
            ? role.name.toUpperCase()
            : String(role.name).toUpperCase()
        return roleName === 'ADMIN' || roleName === 'EMPLOYER'
      })

      console.log('Admin Layout - Has Admin Access:', hasAdminAccess)

      setIsChecking(false)

      if (!hasAdminAccess) {
        console.warn(
          'User does not have required access to admin, redirecting to 403'
        )
        router.push('/403')
      }
    }

    checkAdminAccess()
  }, [isLoading, user, isAuthenticated, fetchCurrentUser, router])

  // Show loading while checking
  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  const isEmployer = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return (
      roleName === 'EMPLOYER' &&
      !user?.roles?.some((r) => {
        const rName =
          typeof r.name === 'string'
            ? r.name.toUpperCase()
            : String(r.name).toUpperCase()
        return rName === 'ADMIN'
      })
    )
  })

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width, hidden on mobile */}
        <aside className="hidden lg:block">
          {isEmployer ? <EmployerSidebar /> : <AdminSidebar />}
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header - Sticky top */}
          <AdminHeader />

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 lg:p-6">{children}</div>
          </main>

          {/* Footer - Fixed bottom */}
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}
