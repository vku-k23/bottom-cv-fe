'use client'
import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('Hero')
  return (
    <section className="relative bg-white pt-6 pb-14 lg:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl leading-tight font-semibold text-gray-900 md:text-4xl lg:text-[36px]">
              {t('heading')}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
              {t('subheading')}
            </p>
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-2 md:flex-row"
              >
                <div className="flex flex-1 items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-within:border-blue-500">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
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
                  <input
                    type="text"
                    placeholder={t('jobPlaceholder')}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-1 items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-within:border-blue-500">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 12.414A6 6 0 1012.414 13.414l4.243 4.243 1-1z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('locationPlaceholder')}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <button className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  {t('buttonFindJob')}
                </button>
              </form>
              <p className="mt-2 pl-1 text-[11px] text-gray-400">
                {t('suggestions')}
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:max-w-md md:grid-cols-4">
              {[
                { label: 'Live Job', value: '175,324', icon: '📄' },
                { label: 'Companies', value: '97,354', icon: '🏢' },
                { label: 'Candidates', value: '38,47154', icon: '👥' },
                { label: 'New Jobs', value: '7,532', icon: '🆕' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm"
                >
                  <div className="text-xl">{s.icon}</div>
                  <p className="mt-1 text-xs font-medium tracking-wide text-gray-900">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-wide text-gray-400 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <Image
              src="/home/hero-illustration.svg"
              alt="Hero Illustration"
              width={520}
              height={420}
              priority
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
