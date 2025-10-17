'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function CTASections() {
  const { t } = useTranslation()
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* For Job Seekers - Gray Card */}
          <div className="flex-1 rounded-xl bg-gray-100 p-12">
            <div className="mb-6">
              <h3 className="mb-4 text-2xl font-medium text-gray-900">
                {t('CTA.jobSeekersTitle')}
              </h3>
              <p className="text-sm text-gray-600 opacity-80">
                {t('CTA.jobSeekersDescription')}
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-3 rounded bg-white px-6 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-gray-50"
            >
              {t('CTA.getStarted')} <ArrowRight className="h-6 w-6" />
            </Link>
          </div>

          {/* For Employers - Blue Card */}
          <div className="flex-1 rounded-xl bg-blue-600 p-12">
            <div className="mb-6">
              <h3 className="mb-4 text-2xl font-medium text-white">
                {t('CTA.employersTitle')}
              </h3>
              <p className="text-sm text-white opacity-80">
                {t('CTA.employersDescription')}
              </p>
            </div>
            <Link
              href="/employer/signup"
              className="inline-flex items-center gap-3 rounded bg-white px-6 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-gray-50"
            >
              {t('CTA.postJobs')} <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
