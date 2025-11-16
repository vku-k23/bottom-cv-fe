'use client'

import { useQuery } from '@tanstack/react-query'
import { jobService } from '@/lib/jobService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = Number(params.id)

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-job', jobId],
    queryFn: () => jobService.getJobById(jobId),
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading job...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading job</p>
          <Button onClick={() => router.push('/admin/jobs')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  const jobTypeStr =
    typeof job.jobType === 'string'
      ? job.jobType
      : (job.jobType as { displayName?: string; name?: string })?.displayName ||
        (job.jobType as { displayName?: string; name?: string })?.name ||
        'N/A'
  const statusStr =
    typeof job.status === 'string'
      ? job.status
      : (job.status as { displayName?: string; name?: string })?.displayName ||
        (job.status as { displayName?: string; name?: string })?.name ||
        'N/A'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-gray-600">Job Details</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Job
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Title
                </label>
                <p className="mt-1 text-lg text-gray-900">{job.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {job.jobDescription || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Requirements
                </label>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {job.jobRequirement || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Benefits
                </label>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {job.jobBenefit || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Company
                </label>
                <p className="mt-1 text-gray-900">
                  {job.company?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Job Type
                </label>
                <Badge className="mt-1">{jobTypeStr}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <p className="mt-1 text-gray-900">{job.location || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Salary
                </label>
                <p className="mt-1 text-gray-900">
                  {job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Work Time
                </label>
                <p className="mt-1 text-gray-900">{job.workTime || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={
                      statusStr === 'ACTIVE'
                        ? 'default'
                        : statusStr === 'PENDING'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {statusStr}
                  </Badge>
                </div>
              </div>
              {job.expiryDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Expiry Date
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(job.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {job.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created At
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(job.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {job.categories && job.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.categories.map((cat) => (
                    <Badge key={cat.id} variant="outline">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
