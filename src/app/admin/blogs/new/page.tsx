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
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { categoryService } from '@/lib/categoryService'

export default function NewBlogPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

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

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
  })

  const categories = categoriesData?.data || []

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: BlogRequest) => blogService.createBlog(data),
    onSuccess: () => {
      toast.success('Blog created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
      router.push('/admin/blogs')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog')
    },
  })

  const handleSubmit = (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    const data = {
      ...formData,
      status: asDraft ? BlogStatus.DRAFT : BlogStatus.PUBLISHED,
    }
    createMutation.mutate(data)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
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
          <h1 className="text-xl font-medium text-gray-900">Create New Blog</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={createMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, false)}
            disabled={createMutation.isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            Publish
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
                onChange={(e) => handleTitleChange(e.target.value)}
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
                placeholder="auto-generated-from-title"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to auto-generate from title
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Max 500 characters. Used for blog list preview.
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                HTML content is supported for rich text formatting.
              </p>
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
                placeholder="SEO title (defaults to blog title)"
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
                placeholder="SEO description for search engines"
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
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated keywords for SEO
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
