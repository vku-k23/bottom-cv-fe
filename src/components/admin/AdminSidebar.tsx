'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building,
  Flag,
  Settings,
  FileText,
  CreditCard,
  FolderTree,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  titleKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: ('ADMIN' | 'EMPLOYER')[] // Roles that can see this item
}

const allNavItems: NavItem[] = [
  {
    titleKey: 'Admin.sidebar.dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EMPLOYER'],
  },
  {
    titleKey: 'Admin.sidebar.users',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'], // Only Admin can manage users
  },
  {
    titleKey: 'Admin.sidebar.jobs',
    href: '/admin/jobs',
    icon: Briefcase,
    roles: ['ADMIN', 'EMPLOYER'],
  },
  {
    titleKey: 'Admin.sidebar.jobModeration',
    href: '/admin/moderation',
    icon: Briefcase, // Change icon for moderation? Figma has Briefcase.
    roles: ['ADMIN'], // Only Admin can do moderation
  },
  {
    titleKey: 'Admin.sidebar.companies',
    href: '/admin/companies',
    icon: Building,
    roles: ['ADMIN'], // Admin can manage all companies
  },
  {
    titleKey: 'Admin.sidebar.employerCompanyProfile', // New item for employer
    href: '/admin/company-profile',
    icon: Building,
    roles: ['EMPLOYER'], // Employer's own company profile
  },
  {
    titleKey: 'Admin.sidebar.reports',
    href: '/admin/reports',
    icon: Flag,
    roles: ['ADMIN'],
  },
  {
    titleKey: 'Admin.sidebar.categories',
    href: '/admin/categories',
    icon: FolderTree,
    roles: ['ADMIN'],
  },
  {
    titleKey: 'Admin.sidebar.payments',
    href: '/admin/payments',
    icon: CreditCard,
    roles: ['ADMIN'],
  },
  {
    titleKey: 'Admin.sidebar.settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN', 'EMPLOYER'],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAuth()

  const userRoles = user?.roles?.map((role) => role.name) || []
  const filteredNavItems = allNavItems.filter((item) => {
    if (!item.roles) return true // If no roles defined, visible to all by default (or assume public/default role)
    return item.roles.some((role) => userRoles.includes(role))
  })

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            BottomCV Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.titleKey)}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium tracking-wide text-blue-900 uppercase">
            {t('Admin.sidebar.systemStatus')}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-blue-700">
              {t('Admin.sidebar.allSystemsOperational')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
