'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from './Breadcrumb'
import { JobDetailHeader, JobHeaderInfo } from './JobDetailHeader'
import { JobOverviewCard, JobOverview } from './JobOverviewCard'
import { CompanyProfileCard, CompanyProfile } from './CompanyProfileCard'
import { JobDetailContent, JobContent } from './JobDetailContent'
import { RelatedJobsSection } from './RelatedJobsSection'
import { JobCardProps } from './JobCard'

export interface JobDetailData {
  header: JobHeaderInfo
  overview: JobOverview
  company: CompanyProfile
  content: JobContent
  relatedJobs: JobCardProps[]
}

interface JobDetailPageProps {
  jobId: string
}

// Mock data - Replace with API call
const MOCK_JOB: JobDetailData = {
  header: {
    id: '1',
    title: 'Senior UX Designer',
    companyName: 'Instagram',
    featured: true,
    jobType: 'Full Time',
    website: 'https://instagram.com',
    phone: '(406) 555-0120',
    email: 'career@instagram.com',
    expirationDate: 'June 30, 2021',
  },
  overview: {
    datePosted: '14 June, 2021',
    expirationDate: '14 July, 2021',
    education: 'Graduation',
    salary: '$50k-80k/month',
    location: 'New York, USA',
    jobType: 'Full Time',
    experience: '10-15 Years',
  },
  company: {
    name: 'Instagram',
    description: 'Social networking service',
    foundedIn: 'March 21, 2006',
    organizationType: 'Private Company',
    companySize: '120-300 Employers',
    phone: '(406) 555-0120',
    email: 'twitter@gmail.com',
    website: 'https://twitter.com',
  },
  content: {
    description: [
      'Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor, dapibus euismod ante ultricies. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.',
      'Nam dapibus consectetur erat in euismod. Cras urna augue, mollis venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci interdum tincidunt.',
    ],
    responsibilities: [
      'Quisque semper gravida est et consectetur.',
      'Curabitur blandit lorem velit, vitae pretium leo placerat eget.',
      'Morbi mattis in ipsum ac tempus.',
      'Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.',
      'vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.',
      'lobortis vel lectus. Nulla at risus ut diam.',
      'commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.',
      'odio metus posuere lorem, id condimentum erat velit nec neque.',
      'dui sodales ut. Curabitur tempus augue.',
    ],
  },
  relatedJobs: [
    {
      id: '2',
      title: 'Visual Designer',
      company: 'Freepik',
      location: 'China',
      jobType: 'Full Time',
      salary: '$10K-$15K',
      featured: true,
    },
    {
      id: '3',
      title: 'Front End Developer',
      company: 'Instagram',
      location: 'Australia',
      jobType: 'Contract Base',
      salary: '$50K-$80K',
      featured: true,
    },
    {
      id: '4',
      title: 'Technical Support Specialist',
      company: 'Upwork',
      location: 'France',
      jobType: 'Full Time',
      salary: '$35K-$40K',
      featured: false,
    },
    {
      id: '5',
      title: 'Interaction Designer',
      company: 'Youtube',
      location: 'Germany',
      jobType: 'Full Time',
      salary: '$20K-$25K',
      featured: false,
    },
  ],
}

export function JobDetailPage({ jobId }: JobDetailPageProps) {
  const { t } = useTranslation()
  const [job] = useState<JobDetailData>(MOCK_JOB) // TODO: Fetch from API using jobId

  const handleApply = () => {
    console.log('Apply to job:', jobId)
    // TODO: Implement apply logic
  }

  const handleSave = () => {
    console.log('Save job:', jobId)
    // TODO: Implement save logic
  }

  const handleShare = (platform: string) => {
    console.log('Share on:', platform)
    // TODO: Implement share logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          title={t('JobDetail.jobDetails') || 'Job Details'}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            { label: t('Jobs.findJob') || 'Find Job', href: '/jobs' },
            { label: 'Graphics & Design', href: '/jobs?category=design' },
            { label: t('JobDetail.jobDetails') || 'Job Details' },
          ]}
        />

        {/* Job Header */}
        <JobDetailHeader
          job={job.header}
          onApply={handleApply}
          onSave={handleSave}
        />

        {/* Main Content */}
        <div className="grid gap-6 pb-12 lg:grid-cols-[1fr_536px]">
          {/* Left Column: Description & Responsibilities */}
          <JobDetailContent content={job.content} onShare={handleShare} />

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            <JobOverviewCard overview={job.overview} />
            <CompanyProfileCard company={job.company} />
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      <RelatedJobsSection jobs={job.relatedJobs} />
    </div>
  )
}
