'use client'
import React from 'react'
import { useTranslations } from 'next-intl'

export function HowItWorks() {
  const t = useTranslations('HowItWorks')
  const steps = [
    { title: t('steps.0.title'), desc: t('steps.0.desc'), highlight: false },
    { title: t('steps.1.title'), desc: t('steps.1.desc'), highlight: true },
    { title: t('steps.2.title'), desc: t('steps.2.desc'), highlight: false },
    { title: t('steps.3.title'), desc: t('steps.3.desc'), highlight: false },
  ]

  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-14 text-center text-xl font-semibold text-gray-900 md:text-2xl">
          {t('heading')}
        </h2>
        <div className="relative grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`relative rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition md:pt-8 ${
                s.highlight ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                {s.desc}
              </p>
            </div>
          ))}
          <div className="pointer-events-none absolute top-14 left-0 hidden w-full md:block">
            <div className="bg-dotted-pattern h-0.5 w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
