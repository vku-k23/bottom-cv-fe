'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSwitcher } from '@/components/language-switcher'

// Simple SVG icon components
const SearchIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const BuildingIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const BriefcaseIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2H10a2 2 0 00-2 2v2"
    />
  </svg>
)

const UserIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const MenuIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
)

const XIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const navigation = [
  { name: 'Find Jobs', href: '/jobs', icon: SearchIcon },
  { name: 'Companies', href: '/companies', icon: BuildingIcon },
  { name: 'My Applications', href: '/applications', icon: BriefcaseIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
]

export function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, fetchCurrentUser } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !user) fetchCurrentUser()
  }, [isAuthenticated, user, fetchCurrentUser])
  useEffect(() => setMounted(true), [])

  return (
    <nav
      className="fixed z-100 w-full bg-white shadow-sm"
      suppressHydrationWarning
    >
      {/* Top mini bar */}
      <div className="hidden border-b border-gray-200 bg-gray-50 text-[11px] text-gray-600 lg:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-4 font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.home') : 'Home'}
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.findJob') : 'Find Job'}
              </Link>
            </li>
            <li>
              <Link
                href="/employers"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.employers') : 'Employers'}
              </Link>
            </li>
            <li>
              <Link
                href="/candidates"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.candidates') : 'Candidates'}
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.pricingPlans') : 'Pricing Plans'}
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className="hover:text-blue-600"
                suppressHydrationWarning
              >
                {mounted ? t('Navbar.customerSupports') : 'Customer Supports'}
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <span>{mounted ? t('Navbar.phone') : '📞 +320 495 250'}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600"
              suppressHydrationWarning
            >
              {mounted ? t('Navbar.myJob') : 'MyJob'}
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center text-sm font-medium transition ${
                      pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div
            className="hidden items-center gap-4 md:flex"
            suppressHydrationWarning
          >
            {mounted ? (
              isAuthenticated && user ? (
                <UserAvatar user={user} onLogout={logout} />
              ) : (
                <div className="flex items-center gap-3 text-[11px]">
                  <Link
                    href="/auth/signin"
                    className="font-medium text-gray-600 hover:text-blue-600"
                    suppressHydrationWarning
                  >
                    {mounted ? t('Navbar.signIn') : 'Sign In'}
                  </Link>
                  <Link
                    href="/post-job"
                    className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                    suppressHydrationWarning
                  >
                    {mounted ? t('Navbar.postJob') : 'Post a Job'}
                  </Link>
                </div>
              )
            ) : (
              <div className="h-9 w-20 animate-pulse rounded-md bg-gray-100" />
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" /> {item.name}
                </Link>
              )
            })}
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2 px-2">
                <LanguageSwitcher />
              </div>
              <div className="flex items-center gap-3">
                {mounted && isAuthenticated && user ? (
                  <UserAvatar user={user} onLogout={logout} />
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-sm font-medium text-gray-600"
                      suppressHydrationWarning
                    >
                      {mounted ? t('Navbar.signIn') : 'Sign In'}
                    </Link>
                    <Link
                      href="/post-job"
                      className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-xs font-medium text-white"
                      suppressHydrationWarning
                    >
                      {mounted ? t('Navbar.postJob') : 'Post a Job'}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
