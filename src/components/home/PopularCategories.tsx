'use client'
import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export function PopularCategories() {
  const { t } = useTranslation()
  const categories = t('PopularCategories.categories', {
    returnObjects: true,
  }) as {
    name: string
    highlight?: boolean
  }[]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            {t('PopularCategories.heading')}
          </h2>
          <button className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            {t('PopularCategories.viewAll')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <div
              key={c.name}
              className={`rounded-lg border border-gray-200 bg-white p-4 text-center transition hover:border-blue-500 hover:shadow-sm ${
                c.highlight ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600">
                {c.name.charAt(0)}
              </div>
              <p className="text-[11px] font-medium text-gray-800">{c.name}</p>
              <p className="mt-1 text-[10px] text-gray-400">
                307 {t('PopularCategories.openPositions')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
