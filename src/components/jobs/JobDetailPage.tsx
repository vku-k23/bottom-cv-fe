'use client'

import { useState, useEffect } from 'react'
import { apiClient, API_ENDPOINTS, JobResponse } from '@/lib/api'
import { JobDetailHeader, JobHeaderInfo } from './JobDetailHeader'
import { CompanyProfileCard, CompanyProfile } from './CompanyProfileCard'
import { JobDetailContent, JobContent } from './JobDetailContent'
import { RelatedJobsSection } from './RelatedJobsSection'
import { JobCardProps } from './JobCard'
import Image from 'next/image'

export interface JobDetailData {
  header: JobHeaderInfo
  company: CompanyProfile
  content: JobContent
  relatedJobs: JobCardProps[]
}

interface JobDetailPageProps {
  jobId: string
}

export function JobDetailPage({ jobId }: JobDetailPageProps) {
  const [job, setJob] = useState<JobDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<JobResponse>(
          API_ENDPOINTS.jobs.get(Number(jobId))
        )

        const mappedJob: JobDetailData = {
          header: {
            id: response.id.toString(),
            title: response.title,
            companyName: response.company.name,
            industry:
              response.company.industry || 'Information Technology (IT)',
            companyLogo: response.company.logo || '',
            companyBanner: response.company.cover || '',
          },
          company: {
            name: response.company.name,
            logo: response.company.logo || '',
            description: response.jobDescription || '',
            foundedIn: response.company.foundedYear?.toString() || 'N/A',
            organizationType: response.company.industry || 'Private Company',
            companySize: response.company.companySize || 'N/A',
            teamSize: response.company.companySize || '120-300 Candidates',
            industryTypes: response.company.industry || 'Technology',
            phone: response.company.phone || 'N/A',
            email: response.company.email || 'N/A',
            website: response.company.website || 'N/A',
            socialLinks: response.company.socialMediaLinks || {},
          },
          content: {
            description: response.jobDescription || '',
            benefits: response.jobBenefit || '',
            vision: response.company.introduce || '',
          },
          relatedJobs: [],
        }

        setJob(mappedJob)
      } catch (err) {
        console.error('Failed to fetch job details:', err)
        setError('Failed to load job details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const handleViewOpenPosition = () => {
    // Scroll to open positions section
    const openPositionsSection = document.getElementById('open-positions')
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShare = (platform: string) => {
    console.log('Share on:', platform)
    // TODO: Implement share logic
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Job not found'}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <div className="border-border-gray relative h-80 w-full overflow-hidden rounded-b-lg border">
        <Image
          src={job?.header.companyBanner || ''}
          alt="Company banner"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        {/* Company Info Card - Overlaps banner */}
        <div className="relative z-10 -mt-20 mb-9">
          <JobDetailHeader
            job={job.header}
            onViewOpenPosition={handleViewOpenPosition}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 pb-12 lg:grid-cols-[1fr_538px]">
          {/* Left Column: Description, Benefits, Vision */}
          <JobDetailContent content={job.content} onShare={handleShare} />

          {/* Right Column: Company Profile Sidebar */}
          <div>
            <CompanyProfileCard company={job.company} />
          </div>
        </div>
      </div>

      {/* Open Position Section */}
      <div id="open-positions" className="border-border-gray border-t pt-12">
        <RelatedJobsSection jobs={job.relatedJobs} />
      </div>
    </div>
  )
}
