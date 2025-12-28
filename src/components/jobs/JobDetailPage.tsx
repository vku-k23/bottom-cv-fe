'use client'

import { useState, useEffect } from 'react'
import { apiClient, API_ENDPOINTS, JobResponse } from '@/lib/api'
import { Breadcrumb } from './Breadcrumb'
import { JobDetailHeader, JobHeaderInfo } from './JobDetailHeader'
import { JobOverviewCard, JobOverview } from './JobOverviewCard'
import { CompanyProfileCard, CompanyProfile } from './CompanyProfileCard'
import { JobDetailContent, JobContent } from './JobDetailContent'
import { RelatedJobsSection } from './RelatedJobsSection'
import { JobCardProps } from './JobCard'
import { useTranslation } from '@/hooks/useTranslation'
import { ApplyJobModal } from './ApplyJobModal'

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

export function JobDetailPage({ jobId }: JobDetailPageProps) {
  const { t } = useTranslation()
  const [job, setJob] = useState<JobDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<JobResponse>(
          API_ENDPOINTS.jobs.get(Number(jobId))
        )

        // Helper to format date
        const formatDate = (dateString?: string) => {
          if (!dateString) return 'N/A'
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }

        const mappedJob: JobDetailData = {
          header: {
            id: response.id.toString(),
            title: response.title,
            companyName: response.company?.name || 'Unknown Company',
            companyLogo: response.company?.logo || '',
            featured: false,
            jobType: response.jobType.replace('_', ' '),
            categories: response.categories?.map((c) => c.name) || [],
            website: response.company?.website || '',
            phone: response.company?.phone || '',
            email: response.company?.email || '',
            expirationDate: formatDate(response.expiryDate),
          },
          overview: {
            datePosted: formatDate(response.createdAt),
            expirationDate: formatDate(response.expiryDate),
            education: response.qualification || 'N/A',
            salary: response.salary
              ? `$${response.salary}/month`
              : 'Negotiable',
            location: response.location,
            jobType: response.jobType.replace('_', ' '),
            experience: response.experience || 'N/A',
          },
          company: {
            id: response.company?.id.toString() || '',
            name: response.company?.name || 'Unknown Company',
            logo: response.company?.logo || '',
            description: 'Social networking service',
            foundedIn: response.company?.foundedYear
              ? `March 21, ${response.company.foundedYear}`
              : 'March 21, 2006',
            organizationType: response.company?.industry || 'Private Company',
            companySize: response.company?.companySize || '120-300 Employers',
            teamSize: response.company?.companySize || '120-300 Employers',
            industryTypes: response.company?.industry || 'Technology',
            phone: response.company?.phone || '(406) 555-0120',
            email: response.company?.email || 'twitter@gmail.com',
            website: response.company?.website || 'https://twitter.com',
            socialLinks: response.company?.socialMediaLinks || {},
          },
          content: {
            description: response.jobDescription || '',
            responsibilities: response.jobRequirement
              ? response.jobRequirement.split('\n').filter((r) => r.trim())
              : [],
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

  const handleApply = () => {
    setIsApplyModalOpen(true)
  }

  const handleSave = () => {
    console.log('Save job:', jobId)
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <Breadcrumb
          title={job.header.title}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            { label: t('Jobs.findJob') || 'Find Job', href: '/jobs' },
            { label: job.header.title },
          ]}
        />
      </div>

      {/* Navigation Border */}
      <div className="border-border-gray border-b"></div>

      <div className="mx-auto max-w-7xl py-12">
        {/* Job Header */}
        <div className="mb-8">
          <JobDetailHeader
            job={job.header}
            onApply={handleApply}
            onSave={handleSave}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_536px]">
          {/* Left Column: Job Description & Responsibilities */}
          <JobDetailContent content={job.content} onShare={handleShare} />

          {/* Right Column: Job Overview & Company Profile */}
          <div className="flex flex-col gap-8">
            <JobOverviewCard overview={job.overview} />
            <CompanyProfileCard company={job.company} />
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      <div className="border-border-light border-t pt-12">
        <RelatedJobsSection jobs={job.relatedJobs} />
      </div>

      {job && (
        <ApplyJobModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={Number(jobId)}
          jobTitle={job.header.title}
        />
      )}
    </div>
  )
}
