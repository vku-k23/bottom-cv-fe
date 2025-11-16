'use client'

import { useQuery } from '@tanstack/react-query'
import { userManagementService } from '@/lib/userManagementService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = Number(params.id)

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => userManagementService.getUserById(userId),
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading user...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading user</p>
          <Button onClick={() => router.push('/admin/users')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.profile?.firstName && user.profile?.lastName
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user.username}
            </h1>
            <p className="mt-1 text-gray-600">User Details</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                User Code
              </label>
              <p className="mt-1 font-mono text-gray-900">{user.userCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Username
              </label>
              <p className="mt-1 text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-900">
                {user.profile?.email || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="mt-1 text-gray-900">
                {user.profile?.firstName && user.profile?.lastName
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-gray-900">
                {user.profile?.phoneNumber || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <p className="mt-1 text-gray-900">
                {user.profile?.address || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Roles</label>
              <div className="mt-2 flex flex-wrap gap-2">
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
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-2">
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
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="mt-1 text-gray-900">{user.createdAt || 'N/A'}</p>
            </div>
            {user.profile?.dayOfBirth && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date of Birth
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(user.profile.dayOfBirth).toLocaleDateString()}
                </p>
              </div>
            )}
            {user.profile?.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 text-gray-900">{user.profile.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
