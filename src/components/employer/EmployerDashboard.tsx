'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/adminService'
import { jobService } from '@/lib/jobService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  MoreVertical,
  Eye,
  PlusCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Job {
  id: number
  title: string
  jobType?: string | { displayName?: string; name?: string }
  status: string | { displayName?: string; name?: string }
  expiryDate?: string
  applicationCount?: number
  createdAt?: string
}

export function EmployerDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  // Fetch stats from backend
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['employer-stats'],
    queryFn: () => adminService.getStats(),
  })

  // Fetch recent jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () =>
      jobService.getAllJobs({
        pageNo: 0,
        pageSize: 10,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
  })

  const jobs = jobsData?.data || []

  // Calculate days remaining
  const getDaysRemaining = (expiryDate?: string) => {
    if (!expiryDate) return 'N/A'
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} days remaining` : 'Expired'
  }

  // Get job type display name
  const getJobTypeDisplay = (jobType?: string | { displayName?: string; name?: string }) => {
    if (!jobType) return 'N/A'
    if (typeof jobType === 'string') return jobType
    return jobType.displayName || jobType.name || 'N/A'
  }

  // Get status display
  const getStatusDisplay = (status?: string | { displayName?: string; name?: string }) => {
    if (!status) return { text: 'Unknown', variant: 'secondary' as const }
    const statusStr = typeof status === 'string' ? status : status.name || status.displayName || ''
    const upperStatus = statusStr.toUpperCase()
    
    if (upperStatus === 'ACTIVE') {
      return { text: 'Active', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' }
    }
    if (upperStatus === 'EXPIRED' || upperStatus === 'EXPIRE') {
      return { text: 'Expire', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    }
    return { text: statusStr, variant: 'secondary' as const }
  }

  const userName = user?.profile?.firstName || user?.username || 'User'
  const openJobs = stats?.activeJobs || 0
  const savedCandidates = 0 // TODO: Implement saved candidates count

  if (statsLoading || jobsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Hello, {userName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is your daily activities and applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Open Jobs Card */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">{openJobs}</p>
                <p className="text-sm text-gray-900 opacity-80">Open Jobs</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Candidates Card */}
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">{savedCandidates.toLocaleString()}</p>
                <p className="text-sm text-gray-900 opacity-80">Saved Candidates</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Posted Jobs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-medium text-gray-900">
              Recently Posted Jobs
            </h2>
            <Link href="/admin/jobs">
              <Button variant="ghost" size="sm" className="text-gray-500">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-medium uppercase text-gray-700">
            <div className="col-span-4">JOBS</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-3">APPLICATIONS</div>
            <div className="col-span-3">ACTIONS</div>
          </div>

          {/* Jobs List */}
          <div className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500">No jobs posted yet</p>
                <Link href="/admin/jobs/new">
                  <Button className="mt-4" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            ) : (
              jobs.map((job: Job) => {
                const statusInfo = getStatusDisplay(job.status)
                const StatusIcon = statusInfo.icon
                const daysRemaining = getDaysRemaining(job.expiryDate)
                const jobType = getJobTypeDisplay(job.jobType)

                return (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
                  >
                    {/* Job Info */}
                    <div className="col-span-4 space-y-2">
                      <h3 className="text-base font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{jobType}</span>
                        <span>•</span>
                        <span>{daysRemaining}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      {StatusIcon ? (
                        <Badge
                          variant={statusInfo.variant}
                          className="flex w-fit items-center gap-1"
                        >
                          <StatusIcon className={`h-4 w-4 ${statusInfo.color || ''}`} />
                          {statusInfo.text}
                        </Badge>
                      ) : (
                        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                      )}
                    </div>

                    {/* Applications */}
                    <div className="col-span-3 flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-5 w-5" />
                      <span>{job.applicationCount || 0} Applications</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/jobs/${job.id}/applications`)}
                      >
                        View Applications
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Promote Job
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/jobs/${job.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Mark as expired
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

