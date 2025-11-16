'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  moderationService,
  type ModerationQueueItem,
} from '@/lib/moderationService'
import { DataTable, type Column } from '@/components/admin/shared/DataTable'
import { BulkActionBar } from '@/components/admin/shared/BulkActionBar'
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Eye, Flag } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent } from '@/components/ui/card'

export default function JobModerationPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => Promise<void>
    variant?: 'default' | 'destructive'
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: async () => {},
  })

  // Fetch moderation queue
  const { data, isLoading } = useQuery({
    queryKey: ['moderation-queue', page],
    queryFn: () => moderationService.getModerationQueue(undefined, page, 10),
  })

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (jobId: number) => moderationService.approveJob(jobId),
    onSuccess: () => {
      toast.success('Job approved successfully')
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error('Failed to approve job')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ jobId, reason }: { jobId: number; reason: string }) =>
      moderationService.rejectJob(jobId, { reason }),
    onSuccess: () => {
      toast.success('Job rejected successfully')
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error('Failed to reject job')
    },
  })

  const bulkApproveMutation = useMutation({
    mutationFn: (jobIds: number[]) =>
      moderationService.bulkApproveJobs({ jobIds }),
    onSuccess: () => {
      toast.success('Jobs approved successfully')
      setSelectedJobs([])
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error('Failed to approve jobs')
    },
  })

  // Handlers
  const handleApprove = (jobId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Approve Job',
      description: 'This job will be published and visible to all users.',
      variant: 'default',
      onConfirm: async () => {
        await approveMutation.mutateAsync(jobId)
      },
    })
  }

  const handleReject = (jobId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Reject Job',
      description: 'This job will be rejected. Please provide a reason.',
      variant: 'destructive',
      onConfirm: async () => {
        const reason = prompt('Rejection reason:')
        if (reason) {
          await rejectMutation.mutateAsync({ jobId, reason })
        }
      },
    })
  }

  const bulkRejectMutation = useMutation({
    mutationFn: ({ jobIds, reason }: { jobIds: number[]; reason: string }) =>
      moderationService.bulkRejectJobs({ jobIds, reason }),
    onSuccess: () => {
      toast.success('Jobs rejected successfully')
      setSelectedJobs([])
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error('Failed to reject jobs')
    },
  })

  const handleBulkApprove = async () => {
    const jobIds = selectedJobs.map((id) => parseInt(id))
    await bulkApproveMutation.mutateAsync(jobIds)
  }

  const handleBulkReject = async () => {
    const jobIds = selectedJobs.map((id) => parseInt(id))
    const reason = prompt('Please provide a reason for rejection:')
    if (reason && reason.trim()) {
      await bulkRejectMutation.mutateAsync({ jobIds, reason: reason.trim() })
    } else if (reason === null) {
      // User cancelled
      return
    } else {
      toast.error('Please provide a reason for rejection')
    }
  }

  // Table columns
  const columns: Column<ModerationQueueItem>[] = [
    {
      key: 'title',
      header: 'Job Title',
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">{item.location}</p>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Company',
    },
    {
      key: 'jobType',
      header: 'Type',
      render: (item) => <Badge variant="outline">{item.jobType}</Badge>,
    },
    {
      key: 'salary',
      header: 'Salary',
      render: (item) => (
        <span className="font-medium">
          ${item.salary?.toLocaleString() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'reportCount',
      header: 'Reports',
      render: (item) =>
        item.reportCount > 0 ? (
          <div className="flex items-center space-x-1 text-red-600">
            <Flag className="h-4 w-4" />
            <span className="text-sm font-medium">{item.reportCount}</span>
          </div>
        ) : (
          <span className="text-gray-400">0</span>
        ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (item) => (
        <span className="text-sm text-gray-500">{item.submittedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('View job', item.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(item.id)}
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(item.id)}
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Moderation</h1>
        <p className="mt-1 text-gray-600">Review and approve job postings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.totalElements || 0}</p>
              <p className="text-sm text-gray-600">Pending Jobs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {/* Approved count would come from API */}
                N/A
              </p>
              <p className="text-sm text-gray-600">Approved Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {/* Rejected count would come from API */}
                N/A
              </p>
              <p className="text-sm text-gray-600">Rejected Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={data?.data || []}
        columns={columns}
        selectable
        onSelectionChange={setSelectedJobs}
        loading={isLoading}
        pagination={
          data
            ? {
                currentPage: data.pageNo,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
                totalItems: data.totalElements,
                onPageChange: setPage,
              }
            : undefined
        }
        emptyMessage="No pending jobs for moderation"
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedJobs.length}
        actions={[
          {
            label: 'Approve Selected',
            onClick: handleBulkApprove,
            icon: <Check className="mr-1 h-4 w-4" />,
          },
          {
            label: 'Reject Selected',
            onClick: handleBulkReject,
            variant: 'destructive',
            icon: <X className="mr-1 h-4 w-4" />,
            disabled: bulkRejectMutation.isPending,
          },
        ]}
        onClear={() => setSelectedJobs([])}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
      />
    </div>
  )
}
