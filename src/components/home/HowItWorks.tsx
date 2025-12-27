'use client'
import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, User, Search, Briefcase, CheckCircle } from 'lucide-react'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = t('HowItWorks.steps', { returnObjects: true }) as Array<{
    title: string
    desc: string
    highlight: boolean
  }>

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {t('HowItWorks.heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Get started in just a few simple steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index: number) => {
            const icons = [User, Search, Briefcase, CheckCircle]
            const Icon = icons[index] || User
            return (
              <div
                key={index}
                className={`relative ${step.highlight ? 'lg:scale-110' : ''}`}
              >
                <div
                  className={`text-center ${step.highlight ? 'rounded-2xl bg-blue-600 p-6 text-white shadow-lg' : 'rounded-xl bg-white p-6 shadow-sm'}`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${step.highlight ? 'bg-white/20' : 'bg-blue-100'}`}
                  >
                    <Icon
                      className={`h-8 w-8 ${step.highlight ? 'text-white' : 'text-blue-600'}`}
                    />
                  </div>
                  <h3
                    className={`mb-2 text-lg font-semibold ${step.highlight ? 'text-white' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm ${step.highlight ? 'text-blue-100' : 'text-gray-600'}`}
                  >
                    {step.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div className="absolute top-1/2 -right-4 hidden -translate-y-1/2 transform lg:block">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
