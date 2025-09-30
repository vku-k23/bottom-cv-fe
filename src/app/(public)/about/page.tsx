'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('AboutPage')

  type ValueItem = { title: string; desc: string }
  type TimelineItem = { year: string; text: string }
  type TeamMember = { name: string; role: string }

  const values = t.raw('values') as ValueItem[]
  const timeline = t.raw('timeline') as TimelineItem[]
  const team = t.raw('team') as TeamMember[]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-black">{t('heading')}</h1>
        <p className="mt-4 text-lg text-gray-600">{t('intro')}</p>
      </div>
      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <h2 className="text-xl font-semibold text-black">
            {t('missionTitle')}
          </h2>
          <p>{t('mission')}</p>
          <p>{t('description')}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">
            {t('valuesTitle')}
          </h3>
          <ul className="space-y-3 text-sm">
            {values.map((v) => (
              <li key={v.title} className="flex gap-3">
                <span className="mt-0.5 text-blue-600">◆</span>
                <div>
                  <p className="font-medium text-gray-900">{v.title}</p>
                  <p className="text-gray-600">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="mb-6 text-xl font-semibold text-black">
          {t('journeyTitle')}
        </h2>
        <ol className="relative ml-2 border-l border-gray-200 pl-6">
          {timeline.map((item) => (
            <li key={item.year} className="mb-8 last:mb-0">
              <div className="absolute -left-2.5 h-5 w-5 rounded-full border-2 border-blue-600 bg-white" />
              <time className="text-xs font-medium tracking-wide text-blue-600 uppercase">
                {item.year}
              </time>
              <p className="mt-1 text-sm text-gray-700">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-20">
        <h2 className="mb-8 text-xl font-semibold text-black">
          {t('teamTitle')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                {m.name.slice(0, 2)}
              </div>
              <p className="font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
