'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userManagementService } from '@/lib/userManagementService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'

interface UserFormData {
  username: string
  email: string
  firstName: string
  lastName: string
  status: string
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const userId = Number(params.id)

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => userManagementService.getUserById(userId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UserFormData>()

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.profile?.email || '',
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        status: user.status || 'PENDING',
      })
    }
  }, [user, reset])

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) =>
      userManagementService.updateUserStatus(userId, {
        status: data.status as 'ACTIVE' | 'PENDING' | 'BANNED',
      }),
    onSuccess: () => {
      toast.success('User updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-user', userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      router.push(`/admin/users/${userId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user')
    },
  })

  const onSubmit = (data: UserFormData) => {
    updateMutation.mutate(data)
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="mt-1 text-gray-600">Update user information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                Username cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.status ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="BANNED">Banned</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
