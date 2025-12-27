'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>()

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      categoryService.createCategory(data),
    onSuccess: (data) => {
      toast.success('Category created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      router.push(`/admin/categories/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const onSubmit = (data: CategoryFormData) => {
    createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/categories')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Category
            </h1>
            <p className="mt-1 text-gray-600">Add a new job category</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  )
}
