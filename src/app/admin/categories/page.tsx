'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService, Category } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import { DataTable, Column } from '@/components/admin/shared/DataTable'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog'
import { useTranslation } from '@/hooks/useTranslation'

export default function CategoriesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-categories', page, pageSize],
    queryFn: () =>
      categoryService.getAllCategories({
        pageNo: page,
        pageSize,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success(t('Admin.categories.categoryDeletedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setDeleteDialogOpen(false)
      setSelectedCategory(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || t('Admin.categories.categoryDeletedError'))
    },
  })

  const categories = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id)
    }
  }

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: t('Admin.categories.name'),
      render: (category: Category) => (
        <div>
          <p className="font-medium text-gray-900">{category.name}</p>
          <p className="text-sm text-gray-500">{category.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: t('Admin.categories.descriptionLabel'),
      render: (category: Category) => (
        <p className="max-w-md truncate text-sm text-gray-600">
          {category.description || t('Admin.categories.noDescription')}
        </p>
      ),
    },
    {
      key: 'actions',
      header: t('Admin.categories.actions'),
      render: (category: Category) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/categories/${category.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(category)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('Admin.categories.title')}
          </h1>
          <p className="mt-1 text-gray-600">
            {t('Admin.categories.description')}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('Admin.categories.addCategory')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t('Admin.categories.categories')} ({totalElements})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.categories.loadingCategories')}
              </p>
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-red-500">
                {t('Admin.categories.errorLoadingCategories')}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.categories.noCategoriesFound')}
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={categories} />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('Admin.common.showing')} {page * pageSize + 1}{' '}
                  {t('Admin.common.to')}{' '}
                  {Math.min((page + 1) * pageSize, totalElements)}{' '}
                  {t('Admin.common.of')} {totalElements}{' '}
                  {t('Admin.common.results')}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    {t('Admin.common.previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    {t('Admin.common.next')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('Admin.categories.deleteCategory')}
        description={t('Admin.categories.deleteCategoryConfirm').replace(
          '{name}',
          selectedCategory?.name || ''
        )}
        onConfirm={confirmDelete}
        confirmText={t('Admin.common.delete')}
        variant="destructive"
      />
    </div>
  )
}
