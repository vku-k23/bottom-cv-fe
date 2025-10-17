'use client'
import React from 'react'
import Image from 'next/image'
import { Search, MapPin, Briefcase, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative w-full bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl leading-tight font-medium text-gray-900 lg:text-5xl">
                {t('Hero.heading')}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                {t('Hero.subheading')}
              </p>
            </div>

            {/* Job Search Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                  <Search className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('Hero.jobPlaceholder')}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="flex min-w-0 flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                  <MapPin className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('Hero.locationPlaceholder')}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <button className="w-full flex-shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto">
                  {t('Hero.buttonFindJob')}
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {t('Hero.suggestions')}
              </p>
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="max-w-lg">
                <Image
                  src="/home/Illustration.svg"
                  alt="Job search illustration"
                  width={492}
                  height={382}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">1,75,324</div>
            <div className="text-sm text-gray-500">Live Job</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm ring-2 ring-blue-500">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">97,354</div>
            <div className="text-sm text-gray-500">Companies</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              38,47,154
            </div>
            <div className="text-sm text-gray-500">Candidates</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">7,532</div>
            <div className="text-sm text-gray-500">New Jobs</div>
          </div>
        </div>
      </div>
    </section>
  )
}
