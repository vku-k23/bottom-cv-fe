'use client'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, MapPin, Users } from 'lucide-react'

interface Company {
  name: string
  location: string
  employees: string
  openPositions: number
  isFeatured?: boolean
}

const companies: Company[] = [
  {
    name: 'Google',
    location: 'Mountain View, CA',
    employees: '10,000+',
    openPositions: 245,
    isFeatured: true,
  },
  {
    name: 'Microsoft',
    location: 'Redmond, WA',
    employees: '5,000+',
    openPositions: 189,
  },
  {
    name: 'Apple',
    location: 'Cupertino, CA',
    employees: '8,000+',
    openPositions: 156,
  },
  {
    name: 'Amazon',
    location: 'Seattle, WA',
    employees: '15,000+',
    openPositions: 312,
  },
  {
    name: 'Meta',
    location: 'Menlo Park, CA',
    employees: '6,000+',
    openPositions: 98,
  },
  {
    name: 'Netflix',
    location: 'Los Gatos, CA',
    employees: '2,000+',
    openPositions: 67,
  },
]

export function TopCompanies() {
  const { t } = useTranslation()

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('TopCompanies.heading')}
          </h2>
          <Link
            href="/companies"
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg ${
                company.isFeatured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {company.isFeatured && (
                <div className="absolute -top-2 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  Featured
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{company.employees} employees</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-blue-600">
                        {company.openPositions}
                      </span>{' '}
                      open positions
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/companies/${company.name.toLowerCase()}`}
                  className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  View Jobs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
