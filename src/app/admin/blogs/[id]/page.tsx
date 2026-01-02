'use client'

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { blogService } from '@/lib/blogService'
import { BlogRequest, BlogStatus } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { categoryService } from '@/lib/categoryService'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const blogId = Number(params.id)

  const [formData, setFormData] = useState<BlogRequest>({
    title: '',
    slug: '',
    thumbnail: '',
    content: '',
    excerpt: '',
    status: BlogStatus.DRAFT,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    categoryId: undefined,
  })

  // Fetch blog data
  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['admin-blog', blogId],
    queryFn: () => blogService.getBlogById(blogId),
    enabled: !!blogId,
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
  })

  const categories = categoriesData?.data || []

  // Populate form when blog data is loaded
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        thumbnail: blog.thumbnail || '',
        content: blog.content,
        excerpt: blog.excerpt || '',
        status: blog.status,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        metaKeywords: blog.metaKeywords || '',
        categoryId: blog.category?.id,
      })
    }
  }, [blog])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: BlogRequest) => blogService.updateBlog(blogId, data),
    onSuccess: () => {
      toast.success('Blog updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-blog', blogId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => blogService.deleteBlog(blogId),
    onSuccess: () => {
      toast.success('Blog deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
      router.push('/admin/blogs')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog')
    },
  })

  const handleSubmit = (e: React.FormEvent, status?: BlogStatus) => {
    e.preventDefault()
    const data = {
      ...formData,
      status: status || formData.status,
    }
    updateMutation.mutate(data)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate()
    }
  }

  if (blogLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-9"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-medium text-gray-900">Edit Blog</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              formData.status === BlogStatus.PUBLISHED
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {formData.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          {formData.status === BlogStatus.DRAFT && (
            <Button
              onClick={(e) => handleSubmit(e, BlogStatus.PUBLISHED)}
              disabled={updateMutation.isPending}
            >
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </Button>
          )}
          <Button
            variant={
              formData.status === BlogStatus.PUBLISHED ? 'default' : 'outline'
            }
            onClick={(e) => handleSubmit(e)}
            disabled={updateMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter blog title"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="blog-url-slug"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    thumbnail: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
              {formData.thumbnail && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="h-32 w-48 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId?.toString() || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: value ? Number(value) : undefined,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as BlogStatus,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BlogStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={BlogStatus.PUBLISHED}>
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Short description of the blog post"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog content here (HTML supported)..."
                className="mt-1 font-mono text-sm"
                rows={15}
                required
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
                placeholder="SEO title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="SEO description"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaKeywords: e.target.value,
                  }))
                }
                placeholder="keyword1, keyword2, keyword3"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

