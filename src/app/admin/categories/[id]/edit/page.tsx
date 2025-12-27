'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const categoryId = Number(params.id)

  const { data: category, isLoading } = useQuery({
    queryKey: ['admin-category', categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>()

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
      })
    }
  }, [category, reset])

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      categoryService.updateCategory(categoryId, {
        name: data.name,
        slug: data.slug,
        description: data.description,
      }),
    onSuccess: () => {
      toast.success('Category updated successfully')
      queryClient.invalidateQueries({
        queryKey: ['admin-category', categoryId],
      })
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      router.push(`/admin/categories/${categoryId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const onSubmit = (data: CategoryFormData) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading category...</p>
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
            onClick={() => router.push(`/admin/categories/${categoryId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="mt-1 text-gray-600">Update category information</p>
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
            onClick={() => router.push(`/admin/categories/${categoryId}`)}
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
