'use client'

import { useState } from 'react'
import { CompanyCard } from '@/components/design/CompanyCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { JobCard } from '@/components/design/JobCard'

interface Props {
  id: string
}

export default function CompanyDetailClient({ id }: Props) {
  const [tab, setTab] = useState('overview')
  const company = {
    id,
    name: 'Acme Corp',
    location: 'Remote / USA',
    industry: 'SaaS',
    openings: 4,
    description:
      'Acme Corp builds enterprise SaaS solutions powering modern workflows and automation at scale.',
  }
  const jobs = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    title: i % 2 ? 'Backend Engineer' : 'Frontend Engineer',
    company: company.name,
    location: i % 2 ? 'Remote' : 'Hanoi, VN',
    salary: '$2k - $3k',
    type: 'Full-time',
    level: i % 3 === 0 ? 'Junior' : i % 3 === 1 ? 'Mid' : 'Senior',
    postedAt: `${i + 1}d ago`,
    tags: ['React', 'Typescript', 'Node'].slice(0, (i % 3) + 1),
  }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <CompanyCard
          id={company.id}
          name={company.name}
          location={company.location}
          industry={company.industry}
          openings={company.openings}
          description={company.description}
        />
      </div>
      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 text-sm leading-relaxed text-gray-700 md:col-span-2">
              <p>
                Acme Corp is a forward-thinking SaaS company focused on building
                a unified platform for workflow automation and team
                collaboration. Our products help thousands of teams increase
                productivity and streamline operations.
              </p>
              <p>
                We embrace a remote-first culture with hubs in major cities
                worldwide. Engineers at Acme own features end-to-end,
                collaborate closely with design, and ship iteratively.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Remote-first',
                  'Series B',
                  '100-200 Employees',
                  'Equity',
                ].map((t) => (
                  <Badge key={t} variant="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <aside className="h-fit space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Company Info
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>
                    <strong className="text-gray-800">Founded:</strong> 2019
                  </li>
                  <li>
                    <strong className="text-gray-800">Employees:</strong> 150
                  </li>
                  <li>
                    <strong className="text-gray-800">HQ:</strong> Remote
                  </li>
                  <li>
                    <strong className="text-gray-800">Website:</strong>{' '}
                    acme.example
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Postgres', 'AWS', 'Kafka'].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.map((j) => (
              <JobCard key={j.id} {...j} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="culture">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Our culture values ownership, transparency, and continuous
              learning. Teams operate in small autonomous squads.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Quarterly hack weeks</li>
              <li>Transparent salary bands</li>
              <li>Professional development stipend</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="benefits">
          <div className="space-y-4 text-sm text-gray-700">
            <ul className="list-inside list-disc space-y-1">
              <li>Competitive salary & equity</li>
              <li>Flexible working hours</li>
              <li>Fully remote setup & equipment budget</li>
              <li>Health, dental, vision coverage</li>
              <li>Generous parental leave</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
