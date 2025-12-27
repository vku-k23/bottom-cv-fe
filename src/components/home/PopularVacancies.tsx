'use client'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight } from 'lucide-react'

export function PopularVacancies() {
  const { t } = useTranslation()
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('PopularVacancies.heading')}
          </h2>
          <Link
            href="/jobs"
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(
            t('PopularVacancies.vacancies', { returnObjects: true }) as string[]
          )
            .slice(0, 8)
            .map((vacancy: string, index: number) => (
              <div
                key={index}
                className="job-card-hover group cursor-pointer rounded-xl bg-gray-50 p-4 hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {vacancy}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {Math.floor(Math.random() * 50) + 10}{' '}
                      {t('PopularVacancies.openPositions')}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
