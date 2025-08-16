import Link from 'next/link'
import { JobCard } from '@/components/design/JobCard'
import { CompanyCard } from '@/components/design/CompanyCard'
import { Badge } from '@/components/ui/badge'

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    logo: '/company-logos/techcorp.png',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $170k',
    logo: '/company-logos/startupxyz.png',
  },
  {
    id: 3,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $120k',
    logo: '/company-logos/designstudio.png',
  },
]

const topCompanies = [
  { name: 'Google', logo: '/company-logos/google.png', jobs: 45 },
  { name: 'Microsoft', logo: '/company-logos/microsoft.png', jobs: 32 },
  { name: 'Apple', logo: '/company-logos/apple.png', jobs: 28 },
  { name: 'Amazon', logo: '/company-logos/amazon.png', jobs: 67 },
  { name: 'Meta', logo: '/company-logos/meta.png', jobs: 23 },
  { name: 'Netflix', logo: '/company-logos/netflix.png', jobs: 18 },
]

export default function HomePage() {
  return (
    <div className="mt-[var(--spacing-top)] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Find Your Dream Job
            </h1>
            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
              Connect with top employers and discover opportunities that match
              your skills
            </p>

            {/* Search Bar */}
            <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-lg bg-white p-4 shadow-lg md:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full rounded-md border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full rounded-md border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="rounded-md bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                Search Jobs
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <span className="text-blue-200">Popular searches:</span>
              <Link
                href="/jobs?q=frontend"
                className="text-white hover:underline"
              >
                Frontend Developer
              </Link>
              <Link
                href="/jobs?q=product-manager"
                className="text-white hover:underline"
              >
                Product Manager
              </Link>
              <Link
                href="/jobs?q=data-scientist"
                className="text-white hover:underline"
              >
                Data Scientist
              </Link>
              <Link
                href="/jobs?q=designer"
                className="text-white hover:underline"
              >
                Designer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Featured Jobs
              </h2>
              <p className="text-lg text-gray-600">
                Discover opportunities from top companies
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">Remote Friendly</Badge>
              <Badge variant="outline">High Paying</Badge>
              <Badge variant="outline">Trending</Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((j) => (
              <JobCard
                key={j.id}
                id={j.id}
                title={j.title}
                company={j.company}
                location={j.location}
                salary={j.salary}
                type={j.type}
                level={j.type === 'Contract' ? 'Mid' : 'Senior'}
                postedAt="Today"
                tags={[j.type, 'Featured']}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Top Companies Hiring
            </h2>
            <p className="text-lg text-gray-600">
              Join teams at leading organizations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topCompanies.slice(0, 8).map((c, i) => (
              <CompanyCard
                key={c.name}
                id={i + 1}
                name={c.name}
                logoUrl={c.logo}
                openings={c.jobs}
                location={i % 2 ? 'Remote' : 'USA'}
                industry={i % 3 ? 'Technology' : 'Software'}
                description={`${c.name} is a leading innovator in the tech space.`}
                compact
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/companies"
              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              View All Companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
