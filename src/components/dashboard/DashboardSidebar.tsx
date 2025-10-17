'use client'

import { usePathname } from 'next/navigation'
import { Role } from '@/types'
import {
  Home,
  Briefcase,
  Building,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Users,
  FileText,
  BarChart3,
  Plus,
  User,
  MessageSquare,
  TrendingUp,
  Building2,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
  userRole: Role
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: Role[]
  description?: string
}

// Candidate Navigation Items
const candidateNavigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [Role.CANDIDATE],
    description: 'Overview of your job search activity',
  },
  {
    name: 'Applied Jobs',
    href: '/dashboard/applications',
    icon: Briefcase,
    roles: [Role.CANDIDATE],
    description: 'Track your job applications',
  },
  {
    name: 'Saved Jobs',
    href: '/dashboard/saved-jobs',
    icon: Bookmark,
    roles: [Role.CANDIDATE],
    description: 'Jobs you have saved',
  },
  {
    name: 'Job Alerts',
    href: '/dashboard/alerts',
    icon: Bell,
    badge: '3',
    roles: [Role.CANDIDATE],
    description: 'Get notified about new jobs',
  },
  {
    name: 'CV Builder',
    href: '/dashboard/resume-builder',
    icon: FileText,
    roles: [Role.CANDIDATE],
    description: 'Create and manage your CV',
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    roles: [Role.CANDIDATE],
    description: 'Manage your profile information',
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '2',
    roles: [Role.CANDIDATE],
    description: 'Communicate with employers',
  },
]

// Employer Navigation Items
const employerNavigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: [Role.EMPLOYER],
    description: 'Overview of your company activity',
  },
  {
    name: 'Post Job',
    href: '/dashboard/post-job',
    icon: Plus,
    roles: [Role.EMPLOYER],
    description: 'Create new job postings',
  },
  {
    name: 'My Jobs',
    href: '/dashboard/my-jobs',
    icon: Briefcase,
    roles: [Role.EMPLOYER],
    description: 'Manage your job postings',
  },
  {
    name: 'Applications',
    href: '/dashboard/applications',
    icon: Users,
    roles: [Role.EMPLOYER],
    description: 'Review job applications',
  },
  {
    name: 'Company Profile',
    href: '/dashboard/company',
    icon: Building,
    roles: [Role.EMPLOYER],
    description: 'Manage company information',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: [Role.EMPLOYER],
    description: 'View performance metrics',
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '5',
    roles: [Role.EMPLOYER],
    description: 'Communicate with candidates',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: [Role.EMPLOYER],
    description: 'Account and company settings',
  },
]

// Admin Navigation Items
const adminNavigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
    roles: [Role.ADMIN],
    description: 'System overview and statistics',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: [Role.ADMIN],
    description: 'Manage user accounts',
  },
  {
    name: 'Companies',
    href: '/admin/companies',
    icon: Building2,
    roles: [Role.ADMIN],
    description: 'Manage company profiles',
  },
  {
    name: 'Jobs',
    href: '/admin/jobs',
    icon: Briefcase,
    roles: [Role.ADMIN],
    description: 'Monitor job postings',
  },
  {
    name: 'Applications',
    href: '/admin/applications',
    icon: ClipboardList,
    roles: [Role.ADMIN],
    description: 'Review all applications',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    roles: [Role.ADMIN],
    description: 'System analytics and reports',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: [Role.ADMIN],
    description: 'System configuration',
  },
]

export function DashboardSidebar({
  isOpen,
  onClose,
  userRole,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  // Get navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case Role.CANDIDATE:
        return candidateNavigationItems
      case Role.EMPLOYER:
        return employerNavigationItems
      case Role.ADMIN:
        return adminNavigationItems
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-40 bg-gray-600 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {userRole === Role.CANDIDATE
                  ? 'Job Seeker Tools'
                  : userRole === Role.EMPLOYER
                    ? 'Employer Tools'
                    : 'Admin Tools'}
              </h3>
            </div>

            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  } `}
                  onClick={onClose}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="mt-0.5 text-xs text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
