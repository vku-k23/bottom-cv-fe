'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService, Job } from '@/lib/jobService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import { FilterBar, FilterConfig } from '@/components/admin/shared/FilterBar'
import { DataTable, Column } from '@/components/admin/shared/DataTable'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog'
import { useTranslation } from '@/hooks/useTranslation'

export default function JobsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [jobType, setJobType] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-jobs', page, pageSize, search, jobType, location, status],
    queryFn: () =>
      jobService.getAllJobs({
        pageNo: page,
        pageSize,
        search: search || undefined,
        jobType: jobType || undefined,
        location: location || undefined,
        status: status || undefined,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
  })

  const jobs = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  // Helper function to translate status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('Admin.jobs.active')
      case 'PENDING':
        return t('Admin.jobs.pending')
      case 'INACTIVE':
        return t('Admin.jobs.inactive')
      default:
        return status
    }
  }

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => jobService.deleteJob(id),
    onSuccess: () => {
      toast.success(t('Admin.jobs.jobDeletedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      setDeleteDialogOpen(false)
      setSelectedJob(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || t('Admin.jobs.jobDeletedError'))
    },
  })

  const handleDelete = (job: Job) => {
    setSelectedJob(job)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedJob) {
      deleteMutation.mutate(selectedJob.id)
    }
  }

  const filters: Record<string, FilterConfig> = {
    search: {
      type: 'search',
      placeholder: t('Admin.jobs.searchPlaceholder'),
      value: search,
      onChange: setSearch,
    },
    jobType: {
      type: 'select',
      placeholder: t('Admin.jobs.allTypes'),
      value: jobType,
      onChange: setJobType,
      options: [
        { label: t('Admin.jobs.allTypes'), value: '' },
        { label: t('Admin.jobs.fullTime'), value: 'FULL_TIME' },
        { label: t('Admin.jobs.partTime'), value: 'PART_TIME' },
        { label: t('Admin.jobs.contract'), value: 'CONTRACT' },
        { label: t('Admin.jobs.internship'), value: 'INTERNSHIP' },
        { label: t('Admin.jobs.remote'), value: 'REMOTE' },
      ],
    },
    location: {
      type: 'search',
      placeholder: t('Admin.jobs.locationPlaceholder'),
      value: location,
      onChange: setLocation,
    },
    status: {
      type: 'select',
      placeholder: t('Admin.jobs.allStatus'),
      value: status,
      onChange: setStatus,
      options: [
        { label: t('Admin.jobs.allStatus'), value: '' },
        { label: t('Admin.jobs.active'), value: 'ACTIVE' },
        { label: t('Admin.jobs.pending'), value: 'PENDING' },
        { label: t('Admin.jobs.inactive'), value: 'INACTIVE' },
      ],
    },
  }

  const handleReset = () => {
    setSearch('')
    setJobType('')
    setLocation('')
    setStatus('')
    setPage(0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'INACTIVE':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const columns: Column<Job>[] = [
    {
      key: 'title',
      header: t('Admin.jobs.jobTitle'),
      render: (job: Job) => (
        <div>
          <p className="font-medium text-gray-900">{job.title}</p>
          <p className="text-sm text-gray-500">
            {job.company?.name || 'Unknown Company'}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      header: t('Admin.jobs.type'),
      render: (job: Job) => {
        const jobTypeStr =
          typeof job.jobType === 'string'
            ? job.jobType
            : (job.jobType as { displayName?: string; name?: string })
                ?.displayName ||
              (job.jobType as { displayName?: string; name?: string })?.name ||
              'N/A'
        return (
          <span className="text-sm text-gray-600">
            {jobTypeStr.replace('_', ' ') || 'N/A'}
          </span>
        )
      },
    },
    {
      key: 'location',
      header: t('Admin.jobs.location'),
      render: (job: Job) => (
        <span className="text-sm text-gray-600">{job.location || 'N/A'}</span>
      ),
    },
    {
      key: 'salary',
      header: t('Admin.jobs.salary'),
      render: (job: Job) => (
        <span className="text-sm font-medium text-gray-900">
          {job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('Admin.jobs.status'),
      render: (job: Job) => {
        const statusStr =
          typeof job.status === 'string'
            ? job.status
            : (job.status as { displayName?: string; name?: string })
                ?.displayName ||
              (job.status as { displayName?: string; name?: string })?.name ||
              'N/A'
        return (
          <Badge variant={getStatusColor(statusStr)}>
            {getStatusLabel(statusStr)}
          </Badge>
        )
      },
    },
    {
      key: 'applications',
      header: t('Admin.jobs.applications'),
      render: (job: Job) => (
        <span className="text-sm text-gray-600">
          {job.applicationCount || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('Admin.jobs.actions'),
      render: (job: Job) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/jobs/${job.id}`)}
            title={t('Admin.common.view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('Admin.jobs.edit')}
            onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title={t('Admin.jobs.delete')}
            onClick={() => handleDelete(job)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('Admin.jobs.title')}
          </h1>
          <p className="mt-1 text-gray-600">{t('Admin.jobs.description')}</p>
        </div>
        <Button onClick={() => router.push('/admin/jobs/new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('Admin.jobs.addJob')}
        </Button>
      </div>

      <FilterBar filters={filters} onReset={handleReset} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t('Admin.sidebar.jobs')} ({totalElements})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.jobs.loadingJobs')}
              </p>
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-red-500">
                {t('Admin.jobs.errorLoadingJobs')}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.jobs.noJobsFound')}
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={jobs} />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('Admin.common.showing')} {page * pageSize + 1}{' '}
                  {t('Admin.common.to')}{' '}
                  {Math.min((page + 1) * pageSize, totalElements)}{' '}
                  {t('Admin.common.of')} {totalElements}{' '}
                  {t('Admin.sidebar.jobs').toLowerCase()}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    {t('Admin.common.previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    {t('Admin.common.next')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('Admin.jobs.deleteJob')}
        description={t('Admin.jobs.deleteJobConfirm')}
        onConfirm={confirmDelete}
        confirmText={t('Admin.jobs.delete')}
        variant="destructive"
      />
    </div>
  )
}
