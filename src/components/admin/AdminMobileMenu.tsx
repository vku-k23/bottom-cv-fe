'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface NavItem {
  titleKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { titleKey: 'Admin.sidebar.dashboard', href: '/admin', icon: LayoutDashboard },
  { titleKey: 'Admin.sidebar.users', href: '/admin/users', icon: Users },
  { titleKey: 'Admin.sidebar.jobModeration', href: '/admin/moderation', icon: Briefcase },
  { titleKey: 'Admin.sidebar.companies', href: '/admin/companies', icon: Building },
  { titleKey: 'Admin.sidebar.reports', href: '/admin/reports', icon: Flag },
  { titleKey: 'Admin.sidebar.categories', href: '/admin/categories', icon: FolderTree },
  { titleKey: 'Admin.sidebar.payments', href: '/admin/payments', icon: CreditCard },
  { titleKey: 'Admin.sidebar.settings', href: '/admin/settings', icon: Settings },
]

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden">
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/admin" className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">
                    BottomCV Admin
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}
