'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  userManagementService,
  type User,
  type UserFilterParams,
} from '@/lib/userManagementService'
import { DataTable, type Column } from '@/components/admin/shared/DataTable'
import { FilterBar } from '@/components/admin/shared/FilterBar'
import { BulkActionBar } from '@/components/admin/shared/BulkActionBar'
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Shield, Ban, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersManagementPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<UserFilterParams>({
    page: 0,
    size: 10,
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
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

  // Fetch users with filters
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => userManagementService.getUsers(filters),
  })

  // Mutations
  const activateMutation = useMutation({
    mutationFn: (userId: number) => userManagementService.activateUser(userId),
    onSuccess: () => {
      toast.success('User activated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to activate user')
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      userManagementService.updateUserStatus(userId, {
        status: status as 'ACTIVE' | 'PENDING' | 'BANNED',
      }),
    onSuccess: () => {
      toast.success('User status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to update user status')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: number) => userManagementService.resetPassword(userId),
    onSuccess: () => {
      toast.success(
        'Password reset successfully. New password sent to user via email.'
      )
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to reset password')
    },
  })

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'userCode',
      header: 'User Code',
      render: (user) => (
        <span className="font-mono text-xs">{user.userCode}</span>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      render: (user) => (
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">{user.profile?.email}</p>
        </div>
      ),
    },
    {
      key: 'profile',
      header: 'Name',
      render: (user) => (
        <span>
          {user.profile?.firstName} {user.profile?.lastName}
        </span>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Badge
              key={role.id}
              variant={
                role.name === 'ADMIN'
                  ? 'default'
                  : role.name === 'EMPLOYER'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <Badge
          variant={
            user.status === 'ACTIVE'
              ? 'default'
              : user.status === 'PENDING'
                ? 'secondary'
                : 'destructive'
          }
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (user) => (
        <span className="text-sm text-gray-500">{user.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(user.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          {user.status === 'ACTIVE' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBan(user.id)}
            >
              <Ban className="h-4 w-4 text-red-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleActivate(user.id)}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResetPassword(user.id)}
          >
            <Shield className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  // Handlers
  const handleEdit = (userId: number) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleActivate = (userId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Activate User',
      description: 'Are you sure you want to activate this user?',
      onConfirm: async () => {
        await activateMutation.mutateAsync(userId)
      },
    })
  }

  const handleBan = (userId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Ban User',
      description:
        'Are you sure you want to ban this user? They will no longer be able to access the system.',
      variant: 'destructive',
      onConfirm: async () => {
        await updateStatusMutation.mutateAsync({ userId, status: 'BANNED' })
      },
    })
  }

  const handleResetPassword = (userId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Reset Password',
      description:
        'A new password will be generated and sent to the user via email.',
      onConfirm: async () => {
        await resetPasswordMutation.mutateAsync(userId)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-gray-600">
          Manage all users, roles, and permissions
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={{
          search: {
            type: 'search',
            placeholder: 'Search by username, email, or name...',
            value: filters.search,
            onChange: (value) =>
              setFilters({ ...filters, search: value, page: 0 }),
          },
          role: {
            type: 'select',
            placeholder: 'All Roles',
            value: filters.role,
            options: [
              { label: 'All Roles', value: '' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Employer', value: 'EMPLOYER' },
              { label: 'Candidate', value: 'CANDIDATE' },
            ],
            onChange: (value) => {
              setFilters({
                ...filters,
                role: value
                  ? (value as 'ADMIN' | 'EMPLOYER' | 'CANDIDATE')
                  : undefined,
                page: 0,
              })
            },
          },
          status: {
            type: 'select',
            placeholder: 'All Status',
            value: filters.status,
            options: [
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Banned', value: 'BANNED' },
            ],
            onChange: (value) => {
              setFilters({
                ...filters,
                status: value
                  ? (value as 'ACTIVE' | 'PENDING' | 'BANNED')
                  : undefined,
                page: 0,
              })
            },
          },
        }}
        onReset={() => setFilters({ page: 0, size: 10 })}
      />

      {/* Data Table */}
      <DataTable
        data={data?.data || []}
        columns={columns}
        selectable
        onSelectionChange={setSelectedUsers}
        loading={isLoading}
        pagination={
          data
            ? {
                currentPage: data.pageNo,
                totalPages: data.totalPages,
                pageSize: data.pageSize,
                totalItems: data.totalElements,
                onPageChange: (page) => setFilters({ ...filters, page }),
              }
            : undefined
        }
        emptyMessage="No users found"
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedUsers.length}
        actions={[
          {
            label: 'Activate Selected',
            onClick: () => console.log('Bulk activate', selectedUsers),
            icon: <Check className="mr-1 h-4 w-4" />,
          },
          {
            label: 'Ban Selected',
            onClick: () => console.log('Bulk ban', selectedUsers),
            variant: 'destructive',
            icon: <Ban className="mr-1 h-4 w-4" />,
          },
        ]}
        onClear={() => setSelectedUsers([])}
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
