'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    description:
      'We are looking for a senior software engineer to join our team...',
    requirements: ['5+ years experience', 'React.js', 'Node.js', 'TypeScript'],
    postedAt: '2 days ago',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Join our product team to drive innovation...',
    requirements: [
      '3+ years PM experience',
      'Data-driven',
      'Agile methodology',
    ],
    postedAt: '1 day ago',
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $120k',
    description: 'Design beautiful and intuitive user experiences...',
    requirements: ['Portfolio required', 'Figma/Sketch', 'User research'],
    postedAt: '3 days ago',
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'DataCorp',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$110k - $150k',
    description: 'Analyze large datasets to drive business decisions...',
    requirements: ['Python/R', 'Machine Learning', 'SQL', 'Statistics'],
    postedAt: '5 days ago',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$100k - $140k',
    description: 'Manage cloud infrastructure and deployment pipelines...',
    requirements: ['AWS/Azure', 'Docker/Kubernetes', 'CI/CD', 'Terraform'],
    postedAt: '1 week ago',
  },
  {
    id: 6,
    title: 'Frontend Developer',
    company: 'WebAgency',
    location: 'Austin, TX',
    type: 'Part-time',
    salary: '$60k - $80k',
    description: 'Build responsive web applications...',
    requirements: ['React.js', 'CSS/SASS', 'JavaScript/TypeScript'],
    postedAt: '4 days ago',
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = !typeFilter || job.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600">
            Discover {jobs.length} opportunities from top companies
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search jobs
              </label>
              <Input
                type="text"
                placeholder="Job title or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                type="text"
                placeholder="City, state"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Filters</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 font-medium text-gray-700">
                    Salary Range
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">$50k - $75k</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">$75k - $100k</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">$100k - $150k</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">$150k+</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-gray-700">
                    Experience Level
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">Entry Level</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">Mid Level</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">Senior Level</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-gray-700">
                    Company Size
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">1-10 employees</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">11-50 employees</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">51-200 employees</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded" />
                      <span className="ml-2 text-sm">200+ employees</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">{filteredJobs.length} jobs found</p>
              <select className="rounded-md border border-gray-300 px-3 py-2">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
                <option>Most Relevant</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg transition-colors hover:text-blue-600">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="font-medium text-blue-600">
                          {job.company}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {job.postedAt}
                        </div>
                        <button className="mt-2 text-sm text-gray-400 hover:text-red-500">
                          ♡ Save
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>📍 {job.location}</span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {job.type}
                        </span>
                        <span className="font-semibold text-green-600">
                          {job.salary}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-gray-700">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <button className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
                          Apply Now
                        </button>
                        <button className="rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                <button className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
                  Previous
                </button>
                <button className="rounded-md bg-blue-600 px-3 py-2 text-white">
                  1
                </button>
                <button className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
                  2
                </button>
                <button className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
                  3
                </button>
                <button className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
