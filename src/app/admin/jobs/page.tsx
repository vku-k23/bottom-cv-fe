'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService, Job } from '@/lib/jobService'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckCircle,
  CheckCircle2,
  XCircle,
  XCircle as XCircleIcon,
  Users,
  MoreVertical,
  Plus,
  Eye,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { companyService } from '@/lib/companyService'
import { moderationService } from '@/lib/moderationService'

export default function JobsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')

  // Check if user is ADMIN or EMPLOYER
  const isAdmin = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return roleName === 'ADMIN'
  })

  const isEmployer = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return roleName === 'EMPLOYER'
  })

  // Get employer's company ID
  const employerCompanyId = (user as { company?: { id: number } })?.company?.id

  // Company filter for ADMIN
  const [companyFilter, setCompanyFilter] = useState<string>('ALL')

  // Fetch companies list for ADMIN filter
  const { data: companies } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: () => companyService.getAllCompanies({ pageNo: 0, pageSize: 100 }),
    enabled: isAdmin === true,
  })

  // Determine which companyId to use for filtering
  const filterCompanyId = isEmployer
    ? employerCompanyId // EMPLOYER: always use their company
    : companyFilter && companyFilter !== 'ALL'
      ? Number(companyFilter) // ADMIN: use selected company or all
      : undefined

  // Fetch jobs - filter by company based on role
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-jobs', page, pageSize, statusFilter, filterCompanyId],
    queryFn: () =>
      jobService.getAllJobs({
        pageNo: page,
        pageSize,
        status: statusFilter || undefined,
        companyId: filterCompanyId,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
    enabled: !isEmployer || !!employerCompanyId, // Only fetch if employer has company
  })

  const jobs = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  // Helper function to get job type display
  const getJobTypeDisplay = (
    jobType: string | { displayName?: string; name?: string }
  ) => {
    if (typeof jobType === 'string') {
      return jobType.replace('_', ' ')
    }
    return (
      (jobType as { displayName?: string; name?: string })?.displayName ||
      (jobType as { displayName?: string; name?: string })?.name ||
      'N/A'
    )
  }

  // Helper function to get status
  const getStatus = (job: Job) => {
    const statusStr =
      typeof job.status === 'string'
        ? job.status
        : (job.status as { displayName?: string; name?: string })
            ?.displayName ||
          (job.status as { displayName?: string; name?: string })?.name ||
          'N/A'
    return statusStr.toUpperCase()
  }

  // Helper function to calculate days remaining
  const getDaysRemaining = (job: Job): string => {
    if (!job.expiryDate) return 'No expiry date'
    try {
      const expiryDate = new Date(job.expiryDate)
      const now = new Date()
      const diffTime = expiryDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'Expired'
      if (diffDays === 0) return 'Expires today'
      return `${diffDays} days remaining`
    } catch {
      return 'Invalid date'
    }
  }

  // Mutation for updating job status
  const updateJobStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const job = await jobService.getJobById(id)
      return jobService.updateJob(id, { ...job, status })
    },
    onSuccess: () => {
      toast.success('Job status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update job status'
      toast.error(message)
    },
  })

  const handlePromoteJob = (_jobId: number) => {
    toast('Promote job feature coming soon')
    // TODO: Implement promote job functionality
  }

  const handleMakeExpire = (jobId: number) => {
    updateJobStatusMutation.mutate({ id: jobId, status: 'INACTIVE' })
  }

  // Approve job mutation (for ADMIN)
  const approveJobMutation = useMutation({
    mutationFn: (jobId: number) => moderationService.approveJob(jobId),
    onSuccess: () => {
      toast.success('Job approved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to approve job'
      toast.error(message)
    },
  })

  // Reject job mutation (for ADMIN)
  const rejectJobMutation = useMutation({
    mutationFn: ({ jobId, reason }: { jobId: number; reason?: string }) =>
      moderationService.rejectJob(jobId, {
        reason: reason || 'Job rejected by admin',
      }),
    onSuccess: () => {
      toast.success('Job rejected successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to reject job'
      toast.error(message)
    },
  })

  const handleApproveJob = (jobId: number) => {
    approveJobMutation.mutate(jobId)
  }

  const handleRejectJob = (jobId: number) => {
    const reason = prompt('Please enter rejection reason (optional):')
    if (reason !== null) {
      // User clicked OK (even if reason is empty)
      rejectJobMutation.mutate({ jobId, reason: reason || undefined })
    }
  }

  if (isEmployer && !employerCompanyId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Company Profile Required
          </h2>
          <p className="mb-6 text-gray-600">
            You need to set up your company profile before viewing jobs.
          </p>
          <Button onClick={() => router.push('/admin/company-profile')}>
            Go to Company Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-medium text-gray-900">
            {isEmployer ? 'My Jobs' : 'Jobs'} ({totalElements})
          </h1>
          <div className="flex items-center gap-3">
            {/* Company filter for ADMIN */}
            {isAdmin && companies && (
              <>
                <span className="text-sm text-gray-900">Company</span>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="h-12 w-[200px]">
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Companies</SelectItem>
                    {companies.data.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id.toString()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <span className="text-sm text-gray-900">Job status</span>
            <Select
              value={statusFilter || 'ALL'}
              onValueChange={(value) =>
                setStatusFilter(value === 'ALL' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 w-[164px]">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Jobs</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/jobs/new')} className="h-11">
          <Plus className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </div>

      {/* Jobs List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-[368px_88px_184px_244px] gap-5 border-b border-gray-100 bg-gray-50 px-5 py-2.5">
          <div className="text-xs font-normal text-gray-700">JOBS</div>
          <div className="text-xs font-normal text-gray-700">STATUS</div>
          <div className="text-xs font-normal text-gray-700">APPLICATIONS</div>
          <div className="text-xs font-normal text-gray-700">ACTIONS</div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-red-500">Error loading jobs</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">No jobs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => {
              const status = getStatus(job)
              const isActive = status === 'ACTIVE'
              const isExpired = status === 'INACTIVE' || status === 'EXPIRED'

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-[368px_88px_184px_244px] gap-5 px-5 py-5 transition-colors hover:bg-gray-50"
                >
                  {/* Job Info */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                      <span>{getJobTypeDisplay(job.jobType)}</span>
                      <span>•</span>
                      <span>{getDaysRemaining(job)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {isActive ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          Active
                        </span>
                      </div>
                    ) : isExpired ? (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                          Expire
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-yellow-600">
                          Pending
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Applications */}
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {job.applicationCount || 0} Applications
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/applications?jobId=${job.id}`)
                      }
                      className="text-primary h-12 rounded-sm border-gray-200 bg-gray-50 px-6 text-sm font-semibold uppercase hover:bg-gray-100"
                    >
                      View Applications
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-12 w-12 rounded-md border-gray-200 bg-gray-50 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {/* Approve/Reject actions for ADMIN on PENDING jobs */}
                        {isAdmin && status === 'PENDING' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApproveJob(job.id)}
                              className="flex items-center gap-3 px-4 py-2.5"
                              disabled={approveJobMutation.isPending}
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                Approve Job
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRejectJob(job.id)}
                              className="flex items-center gap-3 px-4 py-2.5"
                              disabled={rejectJobMutation.isPending}
                            >
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                              <span className="text-sm font-medium text-red-600">
                                Reject Job
                              </span>
                            </DropdownMenuItem>
                            <div className="my-1 border-t border-gray-200" />
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handlePromoteJob(job.id)}
                          className="flex items-center gap-3 px-4 py-2.5"
                        >
                          <Plus className="text-primary h-5 w-5" />
                          <span className="text-primary text-sm font-medium">
                            Promote Job
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/jobs/${job.id}`)}
                          className="flex items-center gap-3 px-4 py-2.5"
                        >
                          <Eye className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">
                            View Detail
                          </span>
                        </DropdownMenuItem>
                        {status === 'ACTIVE' && (
                          <DropdownMenuItem
                            onClick={() => handleMakeExpire(job.id)}
                            className="flex items-center gap-3 px-4 py-2.5"
                          >
                            <XCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-normal text-gray-600">
                              Make it Expire
                            </span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 h-12 w-12 rounded-full p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i
              } else if (page < 2) {
                pageNum = i
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 5 + i
              } else {
                pageNum = page - 2 + i
              }
              const isActive = pageNum === page
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`h-12 w-12 rounded-full ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {String(pageNum + 1).padStart(2, '0')}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 h-12 w-12 rounded-full p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
