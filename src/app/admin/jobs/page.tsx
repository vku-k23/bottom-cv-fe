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

export default function JobsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
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

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => jobService.deleteJob(id),
    onSuccess: () => {
      toast.success('Job deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      setDeleteDialogOpen(false)
      setSelectedJob(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete job')
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
      placeholder: 'Search jobs...',
      value: search,
      onChange: setSearch,
    },
    jobType: {
      type: 'select',
      placeholder: 'All Types',
      value: jobType,
      onChange: setJobType,
      options: [
        { label: 'All Types', value: '' },
        { label: 'Full Time', value: 'FULL_TIME' },
        { label: 'Part Time', value: 'PART_TIME' },
        { label: 'Contract', value: 'CONTRACT' },
        { label: 'Internship', value: 'INTERNSHIP' },
        { label: 'Remote', value: 'REMOTE' },
      ],
    },
    location: {
      type: 'search',
      placeholder: 'Location...',
      value: location,
      onChange: setLocation,
    },
    status: {
      type: 'select',
      placeholder: 'All Status',
      value: status,
      onChange: setStatus,
      options: [
        { label: 'All Status', value: '' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Inactive', value: 'INACTIVE' },
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
      header: 'Job Title',
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
      header: 'Type',
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
      header: 'Location',
      render: (job: Job) => (
        <span className="text-sm text-gray-600">{job.location || 'N/A'}</span>
      ),
    },
    {
      key: 'salary',
      header: 'Salary',
      render: (job: Job) => (
        <span className="text-sm font-medium text-gray-900">
          {job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (job: Job) => {
        const statusStr =
          typeof job.status === 'string'
            ? job.status
            : (job.status as { displayName?: string; name?: string })
                ?.displayName ||
              (job.status as { displayName?: string; name?: string })?.name ||
              'N/A'
        return <Badge variant={getStatusColor(statusStr)}>{statusStr}</Badge>
      },
    },
    {
      key: 'applications',
      header: 'Applications',
      render: (job: Job) => (
        <span className="text-sm text-gray-600">
          {job.applicationCount || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (job: Job) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/jobs/${job.id}`)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Edit"
            onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete"
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
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="mt-1 text-gray-600">Manage and moderate job postings</p>
        </div>
        <Button onClick={() => router.push('/admin/jobs/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>

      <FilterBar filters={filters} onReset={handleReset} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Jobs ({totalElements})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
            <>
              <DataTable columns={columns} data={jobs} />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {page * pageSize + 1} to{' '}
                  {Math.min((page + 1) * pageSize, totalElements)} of{' '}
                  {totalElements} jobs
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    Next
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
        title="Delete Job"
        description={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}
