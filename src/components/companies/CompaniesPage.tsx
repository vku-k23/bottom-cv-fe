'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function CompaniesPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('Navbar.employers')}
          </h1>
          <p className="text-lg text-gray-600">
            Explore top companies and their opportunities
          </p>
        </div>
        <div className="mt-12">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Companies Page Coming Soon
            </h2>
            <p className="text-gray-600">
              We&apos;re working on bringing you the best company directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
