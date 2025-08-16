import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Featured Jobs
            </h2>
            <p className="text-lg text-gray-600">
              Discover opportunities from top companies
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="font-medium text-blue-600">
                        {job.company}
                      </CardDescription>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                      <span className="text-sm font-bold">
                        {job.company.slice(0, 2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>📍 {job.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {job.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
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

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {topCompanies.map((company) => (
              <div
                key={company.name}
                className="cursor-pointer rounded-lg bg-white p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
                  <span className="text-lg font-bold">
                    {company.name.slice(0, 2)}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {company.jobs} open positions
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Get hired in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Build a compelling profile that showcases your skills and
                experience
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Search & Apply
              </h3>
              <p className="text-gray-600">
                Browse thousands of jobs and apply to positions that match your
                goals
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Get Hired
              </h3>
              <p className="text-gray-600">
                Connect with employers and land your dream job
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of professionals who found their dream jobs
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup?role=job-seeker"
              className="inline-flex items-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-gray-50"
            >
              Find Jobs
            </Link>
            <Link
              href="/auth/signup?role=HR"
              className="inline-flex items-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Post Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
