'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { apiClient, API_ENDPOINTS, CompanyResponse } from '@/lib/api'
import { Breadcrumb } from '@/components/jobs/Breadcrumb'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import FacebookIcon from '@/assets/icons/facebook.svg'
import TwitterIcon from '@/assets/icons/twitter.svg'
import PinterestIcon from '@/assets/icons/pinterest.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import EnvelopeIcon from '@/assets/icons/envelope.svg'
import SocialFacebookIcon from '@/assets/icons/social-facebook.svg'
import SocialTwitterIcon from '@/assets/icons/social-twitter.svg'
import SocialInstagramIcon from '@/assets/icons/social-instagram.svg'
import SocialYoutubeIcon from '@/assets/icons/social-youtube.svg'
import { JobCard, JobCardProps } from '@/components/jobs/JobCard'
import {
  BriefcaseIcon,
  CalendarIcon,
  TimerIcon,
  WalletIcon,
} from 'lucide-react'
import { Separator } from '@radix-ui/react-dropdown-menu'

export interface CompanyDetailData {
  header: {
    id: string
    name: string
    industry: string
    logo?: string
    banner?: string
  }
  company: {
    name: string
    logo?: string
    description: string
    foundedIn: string
    organizationType: string
    teamSize: string
    industryTypes: string
    phone: string
    email: string
    website: string
    socialLinks?: Record<string, string>
  }
  content: {
    description: string
    benefits: string
    vision: string
  }
  openJobs: JobCardProps[]
}

interface CompanyDetailPageProps {
  companyId: string
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const { t } = useTranslation()
  const [company, setCompany] = useState<CompanyDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch company details from API
        const response = await apiClient.get<CompanyResponse>(
          API_ENDPOINTS.companies.get(Number(companyId))
        )

        // Map API response to CompanyDetailData format
        const mappedData: CompanyDetailData = {
          header: {
            id: response.id.toString(),
            name: response.name,
            industry: response.industry || 'N/A',
            logo: response.logo,
            banner: response.cover,
          },
          company: {
            name: response.name,
            logo: response.logo,
            description: response.introduce || 'No description available.',
            foundedIn: response.foundedYear
              ? response.foundedYear.toString()
              : 'N/A',
            organizationType: 'Private Company', // Backend doesn't have this field
            teamSize: response.companySize || 'N/A',
            industryTypes: response.industry || 'N/A',
            phone: response.phone || 'N/A',
            email: response.email || 'N/A',
            website: response.website || 'N/A',
            socialLinks: response.socialMediaLinks || {},
          },
          content: {
            description: response.introduce || 'No description available.',
            benefits: 'Information not available.', // Backend doesn't have separate benefits field
            vision: 'Information not available.', // Backend doesn't have vision field
          },
          openJobs: (response.jobs || []).map(
            (job): JobCardProps => ({
              id: job.id.toString(),
              title: job.title,
              company: response.name,
              companyLogo: response.logo,
              location: job.location,
              jobType: job.jobType.replace('_', ' '), // Convert FULL_TIME to Full Time
              salary: job.salary
                ? `$${job.salary.toLocaleString()}/month`
                : 'Negotiable',
              featured: false,
            })
          ),
        }

        setCompany(mappedData)
      } catch (err) {
        console.error('Failed to fetch company details:', err)
        setError('Failed to load company details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchCompany()
    }
  }, [companyId])

  const handleViewOpenPosition = () => {
    const openPositionsSection = document.getElementById('open-positions')
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShare = (platform: string) => {
    console.log('Share on:', platform)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Company not found'}
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
          title={company.header.name}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            {
              label: t('Companies.findEmployers') || 'Find Employers',
              href: '/companies',
            },
            { label: company.header.name },
          ]}
        />
      </div>

      {/* Banner Section */}
      <div className="border-border-gray relative h-80 w-full overflow-hidden rounded-b-lg border">
        <Image
          src={company.header.banner || '/images/job-detail-banner.png'}
          alt="Company banner"
          fill
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        {/* Company Info Card - Overlaps banner */}
        <div className="relative z-10 -mt-20 mb-9">
          <div className="border-border-gray flex items-center justify-between gap-6 rounded-xl border bg-white p-10">
            {/* Left: Company Info */}
            <div className="flex items-center gap-6">
              {/* Company Logo */}
              <div className="flex h-20 w-20 items-center justify-center rounded-md">
                {company.header.logo ? (
                  <Image
                    src={company.header.logo}
                    alt={company.header.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
                    <span className="text-2xl font-bold text-gray-600">
                      {company.header.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Company Details */}
              <div className="flex flex-col gap-2.5">
                <h1 className="text-text-dark text-2xl font-medium">
                  {company.header.name}
                </h1>
                <p className="text-text-gray text-base font-normal">
                  {company.header.industry}
                </p>
              </div>
            </div>

            {/* Right: View Open Position Button */}
            <Button
              onClick={handleViewOpenPosition}
              className="bg-blue-primary flex h-14 items-center gap-3 rounded px-8 text-base font-semibold text-white capitalize hover:bg-blue-600"
            >
              View Open Position
              <ArrowRightIcon className="h-6 w-6" style={{ color: 'white' }} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 pb-12 lg:grid-cols-[1fr_538px]">
          {/* Left Column: Description, Benefits, Vision */}
          <div className="flex flex-col gap-9">
            {/* Description */}
            <div className="flex flex-col gap-4">
              <h2 className="text-text-dark text-xl font-medium">
                Description
              </h2>
              <p className="text-text-gray text-base leading-6 font-normal">
                {company.content.description}
              </p>
            </div>

            {/* Company Benefits */}
            {company.content.benefits && (
              <div className="flex flex-col gap-4">
                <h2 className="text-text-dark text-xl font-medium">
                  Company Benefits
                </h2>
                <div className="flex flex-col gap-3">
                  {company.content.benefits.split('\n').map((item, index) => (
                    <p
                      key={index}
                      className="text-text-gray text-base font-normal"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Company Vision */}
            {company.content.vision && (
              <div className="flex flex-col gap-4">
                <h2 className="text-text-dark text-xl font-medium">
                  Company Vision
                </h2>
                <p className="text-text-gray text-base leading-6 font-normal">
                  {company.content.vision}
                </p>
              </div>
            )}

            {/* Share buttons */}
            <div className="flex items-center gap-5">
              <span className="text-sm font-normal text-[#474c54]">
                Share profile:
              </span>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleShare('Facebook')}
                  className="flex h-12 items-center gap-3 rounded border border-transparent px-3"
                >
                  <FacebookIcon
                    className="h-5 w-5"
                    style={{ color: '#0066ff' }}
                  />
                  <span className="text-facebook text-sm font-normal">
                    Facebook
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare('Twitter')}
                  className="flex h-12 items-center gap-3 rounded border border-transparent px-3"
                >
                  <TwitterIcon
                    className="h-5 w-5"
                    style={{ color: '#1da1f2' }}
                  />
                  <span className="text-twitter text-sm font-normal">
                    Facebook
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare('Pinterest')}
                  className="flex h-12 items-center gap-3 rounded border border-transparent px-3"
                >
                  <PinterestIcon
                    className="h-5 w-5"
                    style={{ color: '#ca2127' }}
                  />
                  <span className="text-pinterest text-sm font-normal">
                    Pinterest
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Company Profile */}
          <div className="flex flex-col gap-6">
            {/* Company Profile Stats */}
            <div className="border-bg-blue-light rounded-xl border-2 bg-white p-6">
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <StatItem
                    icon={CalendarIcon}
                    label="Founded in:"
                    value={company.company.foundedIn}
                  />
                  <StatItem
                    icon={TimerIcon}
                    label="Organization type"
                    value={company.company.organizationType}
                  />
                </div>
                <div className="flex gap-6">
                  <StatItem
                    icon={WalletIcon}
                    label="Team size"
                    value={company.company.teamSize}
                  />
                  <StatItem
                    icon={BriefcaseIcon}
                    label="Industry types"
                    value={company.company.industryTypes}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl border-2 border-[rgba(206,224,245,0.70)] bg-white p-6">
              <h3 className="text-text-dark mb-4 text-xl font-medium">
                Contact Information
              </h3>
              <div className="flex flex-col gap-4">
                <ContactItem
                  icon={GlobeIcon}
                  label="Website"
                  value={company.company.website}
                  href={
                    company.company.website !== 'N/A'
                      ? `https://${company.company.website}`
                      : undefined
                  }
                />
                <Separator className="border-border-gray" />
                <ContactItem
                  icon={PhoneIcon}
                  label="Phone"
                  value={company.company.phone}
                />
                <Separator className="border-border-gray" />
                <ContactItem
                  icon={EnvelopeIcon}
                  label="Email address"
                  value={company.company.email}
                />
              </div>
            </div>

            {/* Follow us on */}
            <div className="rounded-xl border-2 border-[rgba(206,224,245,0.70)] bg-white p-6">
              <h3 className="text-text-dark mb-4 text-lg font-medium">
                Follow us on:
              </h3>
              <div className="flex gap-3">
                <button className="bg-blue-primary flex h-10 w-10 items-center justify-center rounded transition-colors hover:opacity-80">
                  <SocialFacebookIcon
                    className="h-4 w-4"
                    style={{ color: '#ffffff' }}
                  />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded bg-white transition-colors hover:opacity-80">
                  <SocialTwitterIcon
                    className="h-4 w-4"
                    style={{ color: '#0a65cc' }}
                  />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded bg-white transition-colors hover:opacity-80">
                  <SocialInstagramIcon
                    className="h-4 w-4"
                    style={{ color: '#0a65cc' }}
                  />
                </button>
                <button className="bg-blue-primary flex h-10 w-10 items-center justify-center rounded transition-colors hover:opacity-80">
                  <SocialYoutubeIcon
                    className="h-4 w-4"
                    style={{ color: '#ffffff' }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Position Section */}
      <div id="open-positions" className="border-border-gray border-t pt-12">
        <div className="mx-auto max-w-7xl pb-24">
          <h2 className="text-text-dark mb-12 text-4xl leading-[48px] font-medium">
            Open Position ({company.openJobs.length.toString().padStart(2, '0')}
            )
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {company.openJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Icon className="h-6 w-6" style={{ color: '#0a65cc' }} />
      <div className="flex flex-col gap-1">
        <p className="text-text-light-gray text-xs font-normal uppercase">
          {label}
        </p>
        <p className="text-text-dark text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-8 w-8 flex-shrink-0" style={{ color: '#0a65cc' }} />
      <div className="flex flex-col gap-1">
        <p className="text-text-light-gray text-xs font-normal uppercase">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark hover:text-blue-primary text-base font-medium"
          >
            {value}
          </a>
        ) : (
          <p className="text-text-dark text-base font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}
