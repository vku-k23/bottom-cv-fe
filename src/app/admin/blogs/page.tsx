'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/lib/blogService'
import { Blog, BlogStatus } from '@/types/blog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  FileText,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'

export default function BlogsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // Fetch blogs
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-blogs', page, pageSize, statusFilter, searchKeyword],
    queryFn: () =>
      blogService.getAllBlogs({
        page,
        size: pageSize,
        status: statusFilter ? (statusFilter as BlogStatus) : undefined,
        keyword: searchKeyword || undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }),
  })

  const blogs = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogService.deleteBlog(id),
    onSuccess: () => {
      toast.success('Blog deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog')
    },
  })

  const handleDelete = (blog: Blog) => {
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-medium text-gray-900">
            Blog Management ({totalElements})
          </h1>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search blogs..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value)
                setPage(0)
              }}
              className="h-12 w-[250px]"
            />
            <span className="text-sm text-gray-900">Status</span>
            <Select
              value={statusFilter || 'ALL'}
              onValueChange={(value) => {
                setStatusFilter(value === 'ALL' ? '' : value)
                setPage(0)
              }}
            >
              <SelectTrigger className="h-12 w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={() => router.push('/admin/blogs/new')}
          className="h-11"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </div>

      {/* Blogs List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_150px_100px_150px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3">
          <div className="text-xs font-medium text-gray-700 uppercase">
            Blog
          </div>
          <div className="text-xs font-medium text-gray-700 uppercase">
            Status
          </div>
          <div className="text-xs font-medium text-gray-700 uppercase">
            Published
          </div>
          <div className="text-xs font-medium text-gray-700 uppercase">
            Views
          </div>
          <div className="text-xs font-medium text-gray-700 uppercase">
            Actions
          </div>
        </div>

        {/* Blogs List */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-red-500">Error loading blogs</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">No blogs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="grid grid-cols-[1fr_120px_150px_100px_150px] gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                {/* Blog Info */}
                <div className="flex items-start gap-4">
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="h-16 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      By {blog.author?.fullName || blog.author?.username}
                    </p>
                    {blog.category && (
                      <span className="inline-flex w-fit rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {blog.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  {blog.status === BlogStatus.PUBLISHED ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        Published
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">
                        Draft
                      </span>
                    </div>
                  )}
                </div>

                {/* Published Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishedAt)}
                </div>

                {/* Views */}
                <div className="flex items-center text-sm text-gray-500">
                  {blog.viewCount.toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                    className="h-9"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                    className="h-9"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/blogs/${blog.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/blogs/${blog.slug}`, '_blank')
                        }
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(blog)}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-10 w-10 rounded-full p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i
              } else if (page < 2) {
                pageNum = i
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 5 + i
              } else {
                pageNum = page - 2 + i
              }
              const isActive = pageNum === page
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`h-10 w-10 rounded-full ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {String(pageNum + 1).padStart(2, '0')}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="h-10 w-10 rounded-full p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
