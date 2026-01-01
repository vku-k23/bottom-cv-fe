'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { KanbanBoard } from './KanbanBoard'
import { KanbanColumnData } from './KanbanColumn'
import {
  applicationService,
  ApplyResponse,
  ApplicationStatus,
} from '@/lib/applicationService'
import { statusColumnService } from '@/lib/statusColumnService'
import { userManagementService, User } from '@/lib/userManagementService'
import { CreateColumnModal } from './CreateColumnModal'
import Link from 'next/link'

interface ApplicationsKanbanPageProps {
  jobId?: number
  jobTitle?: string
}

export function ApplicationsKanbanPage({
  jobId,
  jobTitle,
}: ApplicationsKanbanPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Get jobId from URL if not provided as prop
  const effectiveJobId =
    jobId ||
    (searchParams.get('jobId') ? Number(searchParams.get('jobId')) : undefined)

  // Fetch status columns from backend
  const {
    data: statusColumns,
    isLoading: isLoadingColumns,
    error: columnsError,
  } = useQuery({
    queryKey: ['status-columns', effectiveJobId],
    queryFn: () => {
      if (!effectiveJobId) {
        throw new Error('Job ID is required')
      }
      return statusColumnService.getAllStatusColumns(effectiveJobId)
    },
    enabled: !!effectiveJobId,
  })

  // Fetch applications grouped by status
  const {
    data: groupedApplications,
    isLoading: isLoadingApplications,
    error: applicationsError,
  } = useQuery({
    queryKey: ['applications-grouped', effectiveJobId],
    queryFn: () => {
      if (!effectiveJobId) {
        throw new Error('Job ID is required')
      }
      return applicationService.getApplicationsGroupedByStatus(effectiveJobId)
    },
    enabled: !!effectiveJobId,
  })

  const isLoading = isLoadingColumns || isLoadingApplications
  const error = columnsError || applicationsError

  // Get unique user IDs from all applications
  const userIds = useMemo(() => {
    if (!groupedApplications) return []
    const allApps = Object.values(groupedApplications).flat()
    return Array.from(new Set(allApps.map((app) => app.userId)))
  }, [groupedApplications])

  // Fetch user profiles for all applications (batch fetch)
  const { data: usersData } = useQuery({
    queryKey: ['applications-users', userIds],
    queryFn: async () => {
      const users: Record<number, User> = {}
      // Fetch users in parallel (limit to avoid too many requests)
      const limitedUserIds = userIds.slice(0, 50) // Limit to 50 users for performance
      await Promise.all(
        limitedUserIds.map(async (userId) => {
          try {
            const user = await userManagementService.getUserById(userId)
            users[userId] = user
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error)
          }
        })
      )
      return users
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // Get user info helper
  const getUserInfo = useCallback(
    (
      userId: number
    ):
      | {
          firstName?: string
          lastName?: string
          avatar?: string
          experience?: string
          education?: string
        }
      | undefined => {
      const user = usersData?.[userId]
      if (!user?.profile) return undefined

      // Calculate experience (placeholder - would need actual experience data)
      const experience = '7 Years Experience' // TODO: Calculate from profile data

      // Get education (placeholder - would need actual education data)
      const education = 'Master Degree' // TODO: Get from profile or CV data

      return {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        avatar: user.profile.avatar,
        experience,
        education,
      }
    },
    [usersData]
  )

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle 403 errors - redirect to 403 page without logging out
  useEffect(() => {
    const checkForbiddenError = (err: unknown) => {
      if (
        err instanceof Error &&
        (err as Error & { isForbidden?: boolean }).isForbidden
      ) {
        router.push('/403')
      }
    }

    if (columnsError) {
      checkForbiddenError(columnsError)
    }
    if (applicationsError) {
      checkForbiddenError(applicationsError)
    }
  }, [columnsError, applicationsError, router])

  // Mutation for creating status column
  const createColumnMutation = useMutation({
    mutationFn: (name: string) => {
      if (!effectiveJobId) {
        throw new Error('Job ID is required')
      }
      return statusColumnService.createStatusColumn({
        name,
        jobId: effectiveJobId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-columns'] })
      toast.success('Column created successfully')
      setIsCreateColumnModalOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create column')
    },
  })

  // Mutation for deleting status column
  const deleteColumnMutation = useMutation({
    mutationFn: (columnId: number) => {
      return statusColumnService.deleteStatusColumn(columnId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-columns'] })
      queryClient.invalidateQueries({ queryKey: ['applications-grouped'] })
      toast.success('Column deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete column')
    },
  })

  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
      position,
    }: {
      applicationId: number
      status: ApplicationStatus
      position?: number
    }) =>
      applicationService.updateApplicationStatus(
        applicationId,
        status,
        position
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications-grouped'] })
      toast.success('Application status updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update application status')
    },
  })

  // Handle moving application between columns
  const handleMoveApplication = useCallback(
    async (
      applicationId: number,
      fromStatus: string,
      toStatus: string,
      position?: number
    ) => {
      // Map status strings to ApplicationStatus enum
      // Backend uses StatusJob: PENDING, ACTIVE, INACTIVE
      const statusMap: Record<string, ApplicationStatus> = {
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
      }

      const newStatus = statusMap[toStatus] || (toStatus as ApplicationStatus)

      if (!newStatus || !statusMap[toStatus]) {
        toast.error(`Invalid status: ${toStatus}`)
        return
      }

      // Optimistic update with position
      queryClient.setQueryData(
        ['applications-grouped', effectiveJobId],
        (old: Record<string, ApplyResponse[]> | undefined) => {
          if (!old) return old

          const updated = { ...old }

          // Find the application in all statuses
          let app: ApplyResponse | undefined
          let foundStatus: string | null = null
          for (const statusKey in updated) {
            const found = updated[statusKey]?.find(
              (a) => a.id === applicationId
            )
            if (found) {
              app = found
              foundStatus = statusKey
              // Remove from current status
              updated[statusKey] = updated[statusKey].filter(
                (a) => a.id !== applicationId
              )
              break
            }
          }

          if (!app) return old

          // Update position for all applications in the old status
          if (foundStatus && fromStatus !== toStatus) {
            updated[foundStatus] = updated[foundStatus].map((a, idx) => ({
              ...a,
              position: idx,
            }))
          }

          // Add to new status at specified position
          if (!updated[toStatus]) {
            updated[toStatus] = []
          }

          // Remove if already exists (avoid duplicates)
          updated[toStatus] = updated[toStatus].filter(
            (a) => a.id !== applicationId
          )

          // Insert at position or append
          const updatedApp = {
            ...app,
            status: newStatus,
            position: position ?? updated[toStatus].length,
          }

          if (position !== undefined && position < updated[toStatus].length) {
            updated[toStatus].splice(position, 0, updatedApp)
          } else {
            updated[toStatus].push(updatedApp)
          }

          // Update positions for all applications in the new status
          updated[toStatus] = updated[toStatus].map((a, idx) => ({
            ...a,
            position: idx,
          }))

          return updated
        }
      )

      // Update via API
      await updateStatusMutation.mutateAsync({
        applicationId,
        status: newStatus,
        position,
      })
    },
    [effectiveJobId, updateStatusMutation, queryClient]
  )

  // Build columns from backend status columns and grouped applications
  const buildColumns = useCallback((): KanbanColumnData[] => {
    if (!groupedApplications) return []

    // If no status columns from backend, create default columns from grouped applications
    if (!statusColumns || statusColumns.length === 0) {
      const defaultStatuses: Array<{
        code: string
        name: string
        order: number
      }> = [
        { code: 'PENDING', name: 'Pending', order: 0 },
        { code: 'ACTIVE', name: 'Active', order: 1 },
        { code: 'INACTIVE', name: 'Inactive', order: 2 },
      ]

      return defaultStatuses.map((status) => {
        const applications =
          (groupedApplications[status.code] as ApplyResponse[]) || []

        return {
          id: status.code,
          title: status.name,
          status: status.code,
          applications: applications.sort((a, b) => {
            // Sort by position first, then by date
            if (a.position !== undefined && b.position !== undefined) {
              return a.position - b.position
            }
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
          }),
          isCustom: false,
        }
      })
    }

    // Map status columns to KanbanColumnData
    const columns: KanbanColumnData[] = statusColumns
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((col) => {
        // Find applications for this column by code (match with StatusJob enum)
        // Backend returns Map<StatusJob, List> where StatusJob is enum (PENDING, ACTIVE, INACTIVE)
        const applications =
          (groupedApplications[col.code] as ApplyResponse[]) || []

        return {
          id: col.code,
          title: col.name,
          status: col.code,
          applications: applications.sort((a, b) => {
            // Sort by position first, then by date
            if (a.position !== undefined && b.position !== undefined) {
              return a.position - b.position
            }
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
          }),
          isCustom: !col.isDefault,
          columnId: col.id, // Store backend ID for delete operations
        }
      })

    return columns
  }, [statusColumns, groupedApplications, sortOrder])

  const columns = buildColumns()

  // Handle download CV
  const handleDownloadCV = useCallback(
    async (applicationId: number) => {
      try {
        // Find application
        const app = columns
          .flatMap((col) => col.applications)
          .find((a) => a.id === applicationId)

        if (!app?.cvUrl) {
          toast.error('CV not available')
          return
        }

        // Download CV file using applicationService
        const blob =
          await applicationService.downloadApplicationCV(applicationId)

        // Extract filename from cvUrl (e.g., "applications/123/filename.pdf" -> "filename.pdf")
        const filename = app.cvUrl.split('/').pop() || `CV_${app.id}.pdf`

        // Create download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()

        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success('CV downloaded successfully')
      } catch (error) {
        console.error('Failed to download CV:', error)
        toast.error('Failed to download CV')
      }
    },
    [columns]
  )

  // Handle create column - opens modal
  const handleCreateColumn = useCallback(() => {
    setIsCreateColumnModalOpen(true)
  }, [])

  // Handle submit create column from modal
  const handleSubmitCreateColumn = useCallback(
    async (name: string) => {
      await createColumnMutation.mutateAsync(name)
    },
    [createColumnMutation]
  )

  // Handle edit column
  const handleEditColumn = useCallback(
    (columnId: string) => {
      const column = statusColumns?.find((c) => c.code === columnId)
      if (!column || column.isDefault) {
        toast.error('Cannot edit default columns')
        return
      }

      const newName = prompt('Enter new column name:', column.name)
      if (!newName || newName.trim() === column.name) return

      // TODO: Implement update mutation
      toast('Edit column feature coming soon')
    },
    [statusColumns]
  )

  // Handle delete column
  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      const column = statusColumns?.find((c) => c.code === columnId)
      if (!column || column.isDefault) {
        toast.error('Cannot delete default columns')
        return
      }

      if (!confirm('Are you sure you want to delete this column?')) return

      deleteColumnMutation.mutate(column.id)
    },
    [statusColumns, deleteColumnMutation]
  )

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    // Don't show error UI for 403 - redirect is handled in useEffect
    if (
      error instanceof Error &&
      (error as Error & { isForbidden?: boolean }).isForbidden
    ) {
      return null
    }

    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading applications</p>
          <p className="mt-2 text-sm text-gray-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!effectiveJobId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Job ID is required</p>
          <p className="mt-2 text-sm text-gray-500">
            Please provide a job ID to view applications
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/dashboard/jobs" className="hover:text-gray-900">
          Job
        </Link>
        {jobTitle && (
          <>
            <span>/</span>
            <span className="text-gray-600">{jobTitle}</span>
          </>
        )}
        <span>/</span>
        <span className="text-primary-500 font-medium">Applications</span>
      </div>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1.5">
          <h1 className="text-xl font-medium text-gray-900">
            Job Applications
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>

          {/* Sort Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={sortOrder === 'newest' ? 'default' : 'outline'}
                size="sm"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value) =>
                  setSortOrder(value as 'newest' | 'oldest')
                }
              >
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">
                  Oldest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        onMoveApplication={handleMoveApplication}
        onCreateColumn={handleCreateColumn}
        onEditColumn={handleEditColumn}
        onDeleteColumn={handleDeleteColumn}
        onDownloadCV={handleDownloadCV}
        getUserInfo={getUserInfo}
      />

      {/* Create Column Modal */}
      <CreateColumnModal
        open={isCreateColumnModalOpen}
        onOpenChange={setIsCreateColumnModalOpen}
        onSubmit={handleSubmitCreateColumn}
        existingColumnNames={statusColumns?.map((col) => col.name) || []}
      />
    </div>
  )
}
