'use client'

import { JobCard, JobCardProps } from './JobCard'

interface RelatedJobsSectionProps {
  jobs: JobCardProps[]
}

export function RelatedJobsSection({ jobs }: RelatedJobsSectionProps) {
  // Mock data for demonstration (will be replaced with real API data)
  const mockJobs: JobCardProps[] = [
    {
      id: '1',
      title: 'Visual Designer',
      company: 'Freepik',
      companyLogo: '/images/company-logos/freepik-logo.svg',
      location: 'China',
      jobType: 'Full Time',
      salary: '$10K-$15K',
      featured: true,
    },
    {
      id: '2',
      title: 'Front End Developer',
      company: 'Instagram',
      companyLogo: '/images/company-logos/instagram-logo.svg',
      location: 'Australia',
      jobType: 'Contract Base',
      salary: '$50K-$80K',
    },
    {
      id: '3',
      title: 'Techical Support Specialist',
      company: 'Upwork',
      companyLogo: '/images/company-logos/upwork-logo.svg',
      location: 'France',
      jobType: 'Full Time',
      salary: '$35K-$40K',
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'Facebook',
      companyLogo: '/images/company-logos/facebook-logo.svg',
      location: 'United Kingdom of Great Britain',
      jobType: 'Part Time',
      salary: '$15K-$20K',
    },
    {
      id: '5',
      title: 'Product Designer',
      company: 'Microsoft',
      companyLogo: '/images/company-logos/microsoft-logo.svg',
      location: 'Australia',
      jobType: 'Full Time',
      salary: '$40K-$50K',
    },
  ]

  const displayJobs = jobs.length > 0 ? jobs : mockJobs

  return (
    <div className="mx-auto max-w-7xl pb-24">
      {/* Section Title */}
      <h2 className="text-text-dark mb-12 text-4xl leading-[48px] font-medium">
        Open Position ({displayJobs.length.toString().padStart(2, '0')})
      </h2>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  )
}
