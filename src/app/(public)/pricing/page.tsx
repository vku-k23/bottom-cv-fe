'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const plans = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Basic tools to get started',
      popular: false,
      features: ['Build profile', 'Search jobs', 'Apply to 5 jobs / month'],
      cta: 'Get Started',
    },
    {
      name: 'Pro',
      priceMonthly: 15,
      priceAnnual: 10,
      description: 'Serious job search acceleration',
      popular: true,
      features: [
        'Unlimited applications',
        'Resume analyzer',
        'Email alerts',
        'Advanced filters',
      ],
      cta: 'Upgrade',
    },
    {
      name: 'Elite',
      priceMonthly: 39,
      priceAnnual: 29,
      description: 'Maximum visibility & insights',
      popular: false,
      features: [
        'Everything in Pro',
        'AI cover letters',
        'Priority support',
        'Salary insights',
      ],
      cta: 'Go Elite',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black">Pricing</h1>
        <p className="mt-3 text-gray-600">
          Flexible plans for every stage of your job search.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
          <span
            className={
              !annual ? 'font-semibold text-gray-900' : 'text-gray-500'
            }
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual((a) => !a)}
            className="relative h-6 w-11 rounded-full bg-blue-600 transition focus:outline-none"
            aria-pressed={annual}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-5' : 'translate-x-1'}`}
            />
          </button>
          <span
            className={annual ? 'font-semibold text-gray-900' : 'text-gray-500'}
          >
            Annual <span className="ml-1 text-xs text-green-600">Save 20%</span>
          </span>
        </div>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {plans.map((p) => {
          const price = annual ? p.priceAnnual : p.priceMonthly
          return (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border ${p.popular ? 'border-blue-500 shadow-md ring-1 ring-blue-500/30' : 'border-gray-200'} bg-white p-6 shadow-sm`}
            >
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-lg font-semibold text-black">{p.name}</h2>
                {p.popular && <Badge variant="default">Most Popular</Badge>}
              </div>
              <p className="mb-6 text-sm text-gray-600">{p.description}</p>
              <div className="mb-6 flex items-end gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {price === 0 ? 'Free' : `$${price}`}
                </span>
                {price !== 0 && (
                  <span className="text-xs text-gray-500">/mo</span>
                )}
              </div>
              <ul className="mb-6 space-y-2 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto w-full rounded-md px-4 py-2 text-sm font-medium transition ${p.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'}`}
              >
                {p.cta}
              </button>
            </div>
          )
        })}
      </div>
      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold text-black">
          Compare Features
        </h2>
        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs tracking-wide text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} className="px-4 py-3 font-medium">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                'Unlimited applications',
                'Resume analyzer',
                'Advanced filters',
                'AI cover letters',
                'Priority support',
                'Salary insights',
              ].map((feat) => (
                <tr key={feat} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {feat}
                  </td>
                  {plans.map((p) => {
                    const has =
                      p.features.some((f) =>
                        f
                          .toLowerCase()
                          .includes(feat.split(' ')[0].toLowerCase())
                      ) ||
                      (feat === 'Unlimited applications' &&
                        p.name !== 'Free') ||
                      (feat === 'AI cover letters' && p.name === 'Elite') ||
                      (feat === 'Priority support' &&
                        ['Elite'].includes(p.name)) ||
                      (feat === 'Salary insights' && p.name === 'Elite')
                    return (
                      <td key={p.name} className="px-4 py-3 text-center">
                        {has ? (
                          <span className="text-green-600">✔</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
