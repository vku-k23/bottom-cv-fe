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
import { useTranslation } from '@/hooks/useTranslation'

export default function JobModerationPage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
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
      toast.success(t('Admin.moderation.jobApprovedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error(t('Admin.moderation.jobApprovedError'))
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ jobId, reason }: { jobId: number; reason: string }) =>
      moderationService.rejectJob(jobId, { reason }),
    onSuccess: () => {
      toast.success(t('Admin.moderation.jobRejectedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error(t('Admin.moderation.jobRejectedError'))
    },
  })

  const bulkApproveMutation = useMutation({
    mutationFn: (jobIds: number[]) =>
      moderationService.bulkApproveJobs({ jobIds }),
    onSuccess: () => {
      toast.success(t('Admin.moderation.jobApprovedSuccess'))
      setSelectedJobs([])
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error(t('Admin.moderation.jobApprovedError'))
    },
  })

  // Handlers
  const handleApprove = (jobId: number) => {
    setConfirmDialog({
      open: true,
      title: t('Admin.moderation.approveJob'),
      description: t('Admin.moderation.approveJobConfirm'),
      variant: 'default',
      onConfirm: async () => {
        await approveMutation.mutateAsync(jobId)
      },
    })
  }

  const handleReject = (jobId: number) => {
    setConfirmDialog({
      open: true,
      title: t('Admin.moderation.rejectJob'),
      description: t('Admin.moderation.rejectJobConfirm'),
      variant: 'destructive',
      onConfirm: async () => {
        const reason = prompt(t('Admin.moderation.rejectionReason'))
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
      toast.success(t('Admin.moderation.jobRejectedSuccess'))
      setSelectedJobs([])
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] })
    },
    onError: () => {
      toast.error(t('Admin.moderation.jobRejectedError'))
    },
  })

  const handleBulkApprove = async () => {
    const jobIds = selectedJobs.map((id) => parseInt(id))
    await bulkApproveMutation.mutateAsync(jobIds)
  }

  const handleBulkReject = async () => {
    const jobIds = selectedJobs.map((id) => parseInt(id))
    const reason = prompt(t('Admin.moderation.rejectionReason'))
    if (reason && reason.trim()) {
      await bulkRejectMutation.mutateAsync({ jobIds, reason: reason.trim() })
    } else if (reason === null) {
      // User cancelled
      return
    } else {
      toast.error(t('Admin.moderation.provideRejectionReason'))
    }
  }

  // Table columns
  const columns: Column<ModerationQueueItem>[] = [
    {
      key: 'title',
      header: t('Admin.moderation.jobTitle'),
      render: (item) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-gray-500">{item.location}</p>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: t('Admin.moderation.company'),
    },
    {
      key: 'jobType',
      header: t('Admin.moderation.type'),
      render: (item) => <Badge variant="outline">{item.jobType}</Badge>,
    },
    {
      key: 'salary',
      header: t('Admin.moderation.salary'),
      render: (item) => (
        <span className="font-medium">
          ${item.salary?.toLocaleString() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'reportCount',
      header: t('Admin.moderation.reports'),
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
      header: t('Admin.moderation.submitted'),
      render: (item) => (
        <span className="text-sm text-gray-500">{item.submittedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: t('Admin.moderation.actions'),
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
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Admin.moderation.title')}
        </h1>
        <p className="mt-1 text-gray-600">
          {t('Admin.moderation.description')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{data?.totalElements || 0}</p>
              <p className="text-sm text-gray-600">
                {t('Admin.moderation.pendingJobs')}
              </p>
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
              <p className="text-sm text-gray-600">
                {t('Admin.moderation.approvedToday')}
              </p>
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
              <p className="text-sm text-gray-600">
                {t('Admin.moderation.rejectedToday')}
              </p>
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
        emptyMessage={t('Admin.moderation.noJobsPending')}
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedJobs.length}
        actions={[
          {
            label: t('Admin.moderation.approveSelected'),
            onClick: handleBulkApprove,
            icon: <Check className="mr-1 h-4 w-4" />,
          },
          {
            label: t('Admin.moderation.rejectSelected'),
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
