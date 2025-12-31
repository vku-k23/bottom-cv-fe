'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UserCircle,
  PlusCircle,
  Briefcase,
  Bookmark,
  Notebook,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Employers Profile',
    href: '/admin/company-profile',
    icon: UserCircle,
  },
  {
    title: 'Post a Job',
    href: '/admin/jobs/new',
    icon: PlusCircle,
  },
  {
    title: 'My Jobs',
    href: '/admin/jobs',
    icon: Briefcase,
  },
  {
    title: 'Saved Candidate',
    href: '/admin/saved-candidates',
    icon: Bookmark,
  },
  {
    title: 'Plans & Billing',
    href: '/admin/billing',
    icon: Notebook,
  },
  {
    title: 'All Companies',
    href: '/admin/companies',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function EmployerSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      {/* Sidebar Content */}
      <div className="flex flex-1 flex-col justify-between py-6">
        {/* Navigation Section */}
        <div className="px-6">
          <div className="mb-4">
            <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              EMPLOYERS DASHBOARD
            </h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              // Fix active logic: exact match or child routes, but exclude /admin/jobs/new when checking /admin/jobs
              let isActive = false
              if (item.href === '/admin') {
                // For dashboard, only exact match
                isActive = pathname === item.href
              } else if (item.href === '/admin/jobs') {
                // For My Jobs, match /admin/jobs but NOT /admin/jobs/new
                isActive =
                  pathname === item.href ||
                  (pathname.startsWith('/admin/jobs/') &&
                    !pathname.startsWith('/admin/jobs/new'))
              } else if (item.href === '/admin/jobs/new') {
                // For Post a Job, only exact match
                isActive = pathname === item.href
              } else {
                // For other routes, exact match or starts with
                isActive =
                  pathname === item.href || pathname.startsWith(item.href + '/')
              }
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.title}</span>
                  {isActive && (
                    <div className="ml-auto h-full w-1 rounded-l bg-blue-600" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="border-t border-gray-200 px-6 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-6 w-6" />
            <span>Log-out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
