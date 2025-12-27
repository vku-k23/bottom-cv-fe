'use client'

import { useQuery } from '@tanstack/react-query'
import { categoryService } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = Number(params.id)

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-category', categoryId],
    queryFn: () => categoryService.getCategoryById(categoryId),
  })

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

  if (error || !category) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading category</p>
          <Button
            onClick={() => router.push('/admin/categories')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
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
            onClick={() => router.push('/admin/categories')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="mt-1 text-gray-600">Category Details</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-lg text-gray-900">{category.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Slug</label>
            <p className="mt-1 text-gray-900">{category.slug}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="mt-1 text-gray-900">
              {category.description || 'No description'}
            </p>
          </div>
          {category.createdAt && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="mt-1 text-gray-900">
                {new Date(category.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
