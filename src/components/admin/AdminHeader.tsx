'use client'

import { Bell, Search, LogOut, User, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { AdminMobileMenu } from './AdminMobileMenu'

interface AdminHeaderProps {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string | undefined }>
}

export function AdminHeader({ title, breadcrumbs }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/auth/signin')
  }

  // Generate breadcrumbs from pathname if not provided
  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    if (breadcrumbs) return breadcrumbs

    const paths = pathname.split('/').filter(Boolean)
    const crumbs: Array<{ label: string; href?: string }> = [{ label: 'Dashboard', href: '/admin' }]

    if (paths.length > 1) {
      const pageName = paths[1]
      const formattedName = pageName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      crumbs.push({ label: formattedName })
    }

    return crumbs
  }

  const displayBreadcrumbs = getBreadcrumbs()
  const userEmail =
    user?.profile?.email || user?.username || 'admin@bottomcv.com'
  const userName =
    user?.profile?.firstName && user?.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user?.username || 'Admin'

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile Menu + Title or Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <AdminMobileMenu />
          <div>
            {displayBreadcrumbs.length > 0 ? (
              <nav className="flex items-center space-x-2 text-sm">
                {displayBreadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    {crumb.href ? (
                      <a
                        href={crumb.href}
                        className="text-gray-600 transition-colors hover:text-gray-900"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="font-medium text-gray-900">
                        {crumb.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                {title}
              </h1>
            ) : (
              <h1 className="text-lg font-semibold text-gray-900 lg:text-xl">
                Admin Dashboard
              </h1>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {/* Search - Hidden on mobile */}
          <button
            className="hidden rounded-lg p-2 transition-colors hover:bg-gray-100 md:flex"
            title="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 lg:px-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-gray-500 lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/')}>
                View Site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
