'use client'

import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/lib/companyService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, ArrowLeft, Check, X } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

export default function CompanyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const companyId = Number(params.id)

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-company', companyId],
    queryFn: () => companyService.getCompanyById(companyId),
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading company...</p>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading company</p>
          <Button
            onClick={() => router.push('/admin/companies')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>
      </div>
    )
  }

  const isVerified =
    company.verified === true ||
    (typeof company.verified === 'number' && company.verified === 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/companies')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="mt-1 text-gray-600">Company Details</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/companies/${company.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Company
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company Name
                </label>
                <p className="mt-1 text-lg text-gray-900">{company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Slug
                </label>
                <p className="mt-1 text-gray-900">{company.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Industry
                </label>
                <p className="mt-1 text-gray-900">{company.industry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company Size
                </label>
                <p className="mt-1 text-gray-900">{company.companySize}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Founded Year
                </label>
                <p className="mt-1 text-gray-900">
                  {company.foundedYear || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Introduction
                </label>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {company.introduce || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{company.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-gray-900">{company.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Website
                </label>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <p className="mt-1 text-gray-900">N/A</p>
                )}
              </div>
              {company.addresses &&
                Object.keys(company.addresses).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Addresses
                    </label>
                    <div className="mt-1 space-y-1">
                      {Object.entries(company.addresses).map(([key, value]) => (
                        <p key={key} className="text-gray-900">
                          <span className="font-medium">{key}:</span> {value}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Social Media */}
          {company.socialMediaLinks &&
            Object.keys(company.socialMediaLinks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(company.socialMediaLinks).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-500 capitalize">
                            {key}
                          </span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {value}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Verification Status
                </label>
                <div className="mt-2">
                  <Badge variant={isVerified ? 'default' : 'secondary'}>
                    {isVerified ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <X className="mr-1 h-3 w-3" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>
              </div>
              {company.verificationDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Verified Date
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(company.verificationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {company.verifiedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Verified By
                  </label>
                  <p className="mt-1 text-gray-900">{company.verifiedBy}</p>
                </div>
              )}
              {company.verificationNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Verification Notes
                  </label>
                  <p className="mt-1 text-gray-900">
                    {company.verificationNotes}
                  </p>
                </div>
              )}
              {company.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created At
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(company.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logo & Cover */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.logo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Logo
                  </label>
                  <div className="mt-2">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  </div>
                </div>
              )}
              {company.cover && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Cover Image
                  </label>
                  <div className="mt-2">
                    <Image
                      src={company.cover}
                      alt={`${company.name} cover`}
                      width={800}
                      height={200}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jobs Count */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {company.jobCount || company.jobs?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
