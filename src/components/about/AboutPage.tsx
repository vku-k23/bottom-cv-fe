'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('AboutPage.heading')}
          </h1>
          <p className="text-lg text-gray-600">{t('AboutPage.intro')}</p>
        </div>
        <div className="mt-12">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              {t('AboutPage.missionTitle')}
            </h2>
            <p className="mb-6 text-gray-600">{t('AboutPage.mission')}</p>
            <p className="text-gray-600">{t('AboutPage.description')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
