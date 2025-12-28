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
import { useTranslation } from '@/hooks/useTranslation'

export default function UsersManagementPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
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
      toast.success(t('Admin.users.userActivatedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error(t('Admin.users.userActivatedError'))
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      userManagementService.updateUserStatus(userId, {
        status: status as 'ACTIVE' | 'PENDING' | 'BANNED',
      }),
    onSuccess: () => {
      toast.success(t('Admin.users.userStatusUpdatedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error(t('Admin.users.userStatusUpdatedError'))
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: number) => userManagementService.resetPassword(userId),
    onSuccess: () => {
      toast.success(t('Admin.users.passwordResetSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error(t('Admin.users.passwordResetError'))
    },
  })

  // Helper function to translate status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return t('Admin.users.active')
      case 'PENDING':
        return t('Admin.users.pending')
      case 'BANNED':
        return t('Admin.users.banned')
      case 'INACTIVE':
        return t('Admin.users.inactive')
      default:
        return status
    }
  }

  // Helper function to translate role
  const getRoleLabel = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return t('Admin.users.admin')
      case 'EMPLOYER':
        return t('Admin.users.employer')
      case 'CANDIDATE':
        return t('Admin.users.candidate')
      default:
        return roleName
    }
  }

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'userCode',
      header: t('Admin.users.userCode'),
      render: (user) => (
        <span className="font-mono text-xs">{user.userCode}</span>
      ),
    },
    {
      key: 'username',
      header: t('Admin.users.username'),
      render: (user) => (
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">{user.profile?.email}</p>
        </div>
      ),
    },
    {
      key: 'profile',
      header: t('Admin.users.name'),
      render: (user) => (
        <span>
          {user.profile?.firstName} {user.profile?.lastName}
        </span>
      ),
    },
    {
      key: 'roles',
      header: t('Admin.users.roles'),
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
              {getRoleLabel(role.name)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('Admin.users.status'),
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
          {getStatusLabel(user.status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: t('Admin.users.createdAt'),
      render: (user) => (
        <span className="text-sm text-gray-500">{user.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      header: t('Admin.users.actions'),
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
      title: t('Admin.users.activateUser'),
      description: t('Admin.users.activateUserConfirm'),
      onConfirm: async () => {
        await activateMutation.mutateAsync(userId)
      },
    })
  }

  const handleBan = (userId: number) => {
    setConfirmDialog({
      open: true,
      title: t('Admin.users.banUser'),
      description: t('Admin.users.banUserConfirm'),
      variant: 'destructive',
      onConfirm: async () => {
        await updateStatusMutation.mutateAsync({ userId, status: 'BANNED' })
      },
    })
  }

  const handleResetPassword = (userId: number) => {
    setConfirmDialog({
      open: true,
      title: t('Admin.users.resetPassword'),
      description: t('Admin.users.resetPasswordConfirm'),
      onConfirm: async () => {
        await resetPasswordMutation.mutateAsync(userId)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('Admin.users.title')}
          </h1>
          <p className="mt-1 text-gray-600">{t('Admin.users.description')}</p>
        </div>
        <Button onClick={() => router.push('/admin/users/new')}>
          {t('Admin.users.addUser') || 'Add User'}
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={{
          search: {
            type: 'search',
            placeholder: t('Admin.users.searchPlaceholder'),
            value: filters.search,
            onChange: (value) =>
              setFilters({ ...filters, search: value, page: 0 }),
          },
          role: {
            type: 'select',
            placeholder: t('Admin.users.allRoles'),
            value: filters.role,
            options: [
              { label: t('Admin.users.allRoles'), value: '' },
              { label: t('Admin.users.admin'), value: 'ADMIN' },
              { label: t('Admin.users.employer'), value: 'EMPLOYER' },
              { label: t('Admin.users.candidate'), value: 'CANDIDATE' },
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
            placeholder: t('Admin.users.allStatus'),
            value: filters.status,
            options: [
              { label: t('Admin.users.allStatus'), value: '' },
              { label: t('Admin.users.active'), value: 'ACTIVE' },
              { label: t('Admin.users.pending'), value: 'PENDING' },
              { label: t('Admin.users.banned'), value: 'BANNED' },
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
        emptyMessage={t('Admin.users.noUsersFound')}
      />

      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedUsers.length}
        actions={[
          {
            label: t('Admin.users.activateSelected'),
            onClick: () => console.log('Bulk activate', selectedUsers),
            icon: <Check className="mr-1 h-4 w-4" />,
          },
          {
            label: t('Admin.users.banSelected'),
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
