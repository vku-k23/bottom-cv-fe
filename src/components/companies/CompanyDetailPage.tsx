'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Breadcrumb } from '@/components/jobs/Breadcrumb'
import { CompanyDetailHeader, CompanyHeaderInfo } from './CompanyDetailHeader'
import { CompanyInfoCard, CompanyInfo } from './CompanyInfoCard'
import { CompanyDetailContent, CompanyContent } from './CompanyDetailContent'
import { OpenPositionsSection } from './OpenPositionsSection'
import { JobCardProps } from '@/components/jobs/JobCard'

export interface CompanyDetailData {
  header: CompanyHeaderInfo
  info: CompanyInfo
  content: CompanyContent
  openJobs: JobCardProps[]
}

interface CompanyDetailPageProps {
  companyId: string
}

// Mock data - Replace with API call
const getMockCompanyData = (_companyId: string): CompanyDetailData => ({
  header: {
    id: '1',
    name: 'Twitter',
    category: 'Information Technology (IT)',
    coverImage: '/companies/twitter-cover.jpg', // Placeholder
  },
  info: {
    foundedIn: '14 June, 2021',
    organizationType: 'Private Company',
    teamSize: '120-300 Candidates',
    industryType: 'Technology',
    website: 'www.estherhoward.com',
    phone: '+1-202-555-0141',
    email: 'esther.howard@gmail.com',
    socialMedia: {
      facebook: 'https://facebook.com/twitter',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com/twitter',
    },
  },
  content: {
    description:
      'Fusce et erat at nibh maximus fermentum. Mauris ac justo nibh. Praesent nec lorem lorem. Donec ullamcorper lacus mollis tortor pretium malesuada. In quis porta nisi, quis fringilla orci. Donec porttitor, odio a efficitur blandit, orci nisl porta elit, eget vulputate quam nibh ut tellus. Sed ut posuere risus, vitae commodo velit. Nullam in lorem dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla tincidunt ac quam quis vehicula. Quisque sagittis ullamcorper magna. Vivamus elementum eu leo et gravida. Sed dignissim placerat diam, ac laoreet eros rutrum sit amet. Donec imperdiet in leo et imperdiet. In hac habitasse platea dictumst. Sed quis nisl molestie diam ullamcorper condimentum. Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu, quis suscipit mauris turpis in neque. Vestibulum id vestibulum odio. Sed dolor felis, iaculis eget turpis eu, lobortis imperdiet massa.',
    benefits: [
      'Donec dignissim nunc eu tellus malesuada fermentum. Sed blandit in magna at accumsan. Etiam imperdiet massa aliquam, consectetur leo in, auctor neque.',
      'In hac habitasse platea dictumst.',
      'Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu.',
      'Vestibulum id vestibulum odio.',
      'Etiam libero ante accumsan id tellus venenatis rhoncus vulputate velit.',
      'Nam condimentum sit amet ipsum id malesuada.',
    ],
    vision:
      'Praesent ultrices mauris at nisi euismod, ut venenatis augue blandit. Etiam massa risus, accumsan nec tempus nec, venenatis in nisl. Maecenas nulla ex, blandit in magna id, pellentesque facilisis sapien. In feugiat auctor mi, eget commodo lectus convallis ac.',
  },
  openJobs: [
    {
      id: '1',
      title: 'Visual Designer',
      company: 'Freepik',
      location: 'China',
      jobType: 'Full Time',
      salary: '$10K-$15K',
      featured: true,
    },
    {
      id: '2',
      title: 'Front End Developer',
      company: 'Instagram',
      location: 'Australia',
      jobType: 'Contract Base',
      salary: '$50K-$80K',
      featured: true,
    },
    {
      id: '3',
      title: 'Technical Support Specialist',
      company: 'Upwork',
      location: 'France',
      jobType: 'Full Time',
      salary: '$35K-$40K',
      featured: false,
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'Facebook',
      location: 'United Kingdom of Great Britain',
      jobType: 'Part Time',
      salary: '$15K-$20K',
      featured: false,
    },
    {
      id: '5',
      title: 'Product Designer',
      company: 'Microsoft',
      location: 'Australia',
      jobType: 'Full Time',
      salary: '$40K-$50K',
      featured: false,
    },
  ],
})

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const { t } = useTranslation()
  const [company] = useState<CompanyDetailData>(getMockCompanyData(companyId)) // TODO: Fetch from API using companyId

  const handleViewPositions = () => {
    // Scroll to open positions section
    const element = document.getElementById('open-positions')
    element?.scrollIntoView({ behavior: 'smooth' })
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
          title={t('CompanyDetail.singleEmployers') || 'Single Employers'}
          items={[
            { label: t('Navbar.home') || 'Home', href: '/' },
            {
              label: t('Companies.findEmployers') || 'Find Employers',
              href: '/companies',
            },
            { label: t('CompanyDetail.singleEmployers') || 'Single Employers' },
          ]}
        />
      </div>

      {/* Company Header with Cover Image */}
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <CompanyDetailHeader
          company={company.header}
          onViewPositions={handleViewPositions}
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[724px_1fr]">
          {/* Left Column: Content */}
          <CompanyDetailContent
            content={company.content}
            onShare={handleShare}
          />

          {/* Right Column: Sidebar */}
          <CompanyInfoCard info={company.info} />
        </div>
      </div>

      {/* Open Positions Section */}
      <div id="open-positions">
        <OpenPositionsSection
          companyName={company.header.name}
          jobs={company.openJobs}
        />
      </div>
    </div>
  )
}
