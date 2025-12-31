'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
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
import { userManagementService, User } from '@/lib/userManagementService'
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
  const queryClient = useQueryClient()
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [customColumns, setCustomColumns] = useState<
    Array<{ id: string; title: string; status: string }>
  >([])
  const [isMounted, setIsMounted] = useState(false)

  // Get jobId from URL if not provided as prop
  const effectiveJobId =
    jobId ||
    (searchParams.get('jobId') ? Number(searchParams.get('jobId')) : undefined)

  // Fetch applications grouped by status
  const {
    data: groupedApplications,
    isLoading,
    error,
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

  // Load custom columns from localStorage (only after mount to prevent hydration mismatch)
  useEffect(() => {
    if (!isMounted) return

    const saved = localStorage.getItem('kanban-custom-columns')
    if (saved) {
      try {
        setCustomColumns(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load custom columns:', e)
      }
    }
  }, [isMounted])

  // Save custom columns to localStorage
  const saveCustomColumns = useCallback(
    (columns: Array<{ id: string; title: string; status: string }>) => {
      setCustomColumns(columns)
      if (isMounted) {
        localStorage.setItem('kanban-custom-columns', JSON.stringify(columns))
      }
    },
    [isMounted]
  )

  // Mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: number
      status: ApplicationStatus
    }) => applicationService.updateApplicationStatus(applicationId, status),
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
    async (applicationId: number, fromStatus: string, toStatus: string) => {
      // Skip if moving to "all" column
      if (toStatus === 'all') {
        return
      }

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

      // Optimistic update
      queryClient.setQueryData(
        ['applications-grouped', effectiveJobId],
        (old: Record<string, ApplyResponse[]> | undefined) => {
          if (!old) return old

          const updated = { ...old }
          const app = Object.values(updated)
            .flat()
            .find((a) => a.id === applicationId)

          if (!app) return old

          // Remove from old status (skip if from "all")
          if (fromStatus !== 'all') {
            updated[fromStatus] = (updated[fromStatus] || []).filter(
              (a) => a.id !== applicationId
            )
          }

          // Add to new status (skip if to "all")
          if (toStatus !== 'all') {
            if (!updated[toStatus]) {
              updated[toStatus] = []
            }
            updated[toStatus] = [
              ...updated[toStatus],
              { ...app, status: newStatus },
            ]
          }

          return updated
        }
      )

      // Update via API
      await updateStatusMutation.mutateAsync({
        applicationId,
        status: newStatus,
      })
    },
    [effectiveJobId, updateStatusMutation, queryClient]
  )

  // Build columns from grouped data
  const buildColumns = useCallback((): KanbanColumnData[] => {
    if (!groupedApplications) return []

    // Get all applications across all statuses
    const allApplications = Object.values(groupedApplications).flat()

    const defaultColumns: KanbanColumnData[] = [
      {
        id: 'all',
        title: 'All Applications',
        status: 'all',
        applications: allApplications,
        isCustom: false,
      },
      {
        id: 'PENDING',
        title: 'Pending',
        status: 'PENDING',
        applications: (groupedApplications.PENDING as ApplyResponse[]) || [],
        isCustom: false,
      },
      {
        id: 'ACTIVE',
        title: 'Active',
        status: 'ACTIVE',
        applications: (groupedApplications.ACTIVE as ApplyResponse[]) || [],
        isCustom: false,
      },
      {
        id: 'INACTIVE',
        title: 'Inactive',
        status: 'INACTIVE',
        applications: (groupedApplications.INACTIVE as ApplyResponse[]) || [],
        isCustom: false,
      },
    ]

    // Add custom columns (for now, custom columns don't map to backend statuses)
    // They would need backend support to work properly
    const customCols = customColumns.map((col) => ({
      id: col.id,
      title: col.title,
      status: col.status,
      applications: [], // Custom columns start empty - would need backend support
      isCustom: true,
    }))

    // Sort applications within each column
    const sortedColumns = [...defaultColumns, ...customCols].map((col) => ({
      ...col,
      applications: [...col.applications].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      }),
    }))

    return sortedColumns
  }, [groupedApplications, customColumns, sortOrder])

  const columns = buildColumns()

  // Handle download CV
  const handleDownloadCV = useCallback(
    (applicationId: number) => {
      // Find application
      const app = columns
        .flatMap((col) => col.applications)
        .find((a) => a.id === applicationId)

      if (app?.cvUrl) {
        window.open(app.cvUrl, '_blank')
      } else {
        toast.error('CV not available')
      }
    },
    [columns]
  )

  // Handle create column
  const handleCreateColumn = useCallback(() => {
    const columnName = prompt('Enter column name:')
    if (!columnName) return

    // Use a more stable ID generation to prevent hydration issues
    const timestamp = isMounted
      ? Date.now()
      : Math.floor(Math.random() * 1000000)
    const newColumn = {
      id: `custom-${timestamp}`,
      title: columnName,
      status: `CUSTOM_${columnName.toUpperCase().replace(/\s+/g, '_')}`,
    }

    saveCustomColumns([...customColumns, newColumn])
    toast.success('Column created')
  }, [customColumns, saveCustomColumns, isMounted])

  // Handle edit column
  const handleEditColumn = useCallback(
    (columnId: string) => {
      const column = customColumns.find((c) => c.id === columnId)
      if (!column) return

      const newName = prompt('Enter new column name:', column.title)
      if (!newName) return

      saveCustomColumns(
        customColumns.map((c) =>
          c.id === columnId ? { ...c, title: newName } : c
        )
      )
      toast.success('Column updated')
    },
    [customColumns, saveCustomColumns]
  )

  // Handle delete column
  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      if (!confirm('Are you sure you want to delete this column?')) return

      saveCustomColumns(customColumns.filter((c) => c.id !== columnId))
      toast.success('Column deleted')
    },
    [customColumns, saveCustomColumns]
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
    </div>
  )
}
