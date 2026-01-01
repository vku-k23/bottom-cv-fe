'use client'

import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/lib/blogService'
import { categoryService } from '@/lib/categoryService'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, Calendar } from 'lucide-react'

interface BlogSidebarProps {
  searchKeyword: string
  onSearchChange: (keyword: string) => void
  selectedCategoryId?: number
  onCategoryChange: (categoryId?: number) => void
}

export function BlogSidebar({
  searchKeyword,
  onSearchChange,
  selectedCategoryId,
  onCategoryChange,
}: BlogSidebarProps) {
  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => categoryService.getAllCategories(),
  })

  // Fetch recent blogs
  const { data: recentBlogs } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: () => blogService.getRecentBlogs(),
  })

  const categories = categoriesData?.data || []

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search blogs..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Category</h3>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={!selectedCategoryId}
              onChange={() => onCategoryChange(undefined)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className={`text-sm ${!selectedCategoryId ? 'font-medium text-gray-900' : 'text-gray-600'}`}
            >
              All Categories
            </span>
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                checked={selectedCategoryId === category.id}
                onChange={() =>
                  onCategoryChange(
                    selectedCategoryId === category.id ? undefined : category.id
                  )
                }
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`text-sm ${
                  selectedCategoryId === category.id
                    ? 'font-medium text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Post</h3>
        <div className="space-y-4">
          {recentBlogs?.slice(0, 3).map((blog, index) => (
            <div key={blog.id}>
              <Link
                href={`/blogs/${blog.slug}`}
                className="flex gap-4 transition-opacity hover:opacity-80"
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <span className="text-lg">📝</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(blog.publishedAt)}</span>
                    <span>•</span>
                    <span>{blog.viewCount} Views</span>
                  </div>
                  <p className="line-clamp-2 text-sm font-medium text-gray-900">
                    {blog.title}
                  </p>
                </div>
              </Link>
              {index < 2 && <hr className="mt-4 border-gray-100" />}
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Popular Tag</h3>
        <div className="flex flex-wrap gap-2">
          {['Design', 'Programming', 'Health & Care', 'Motion Design', 'Photography', 'Politics'].map(
            (tag) => (
              <span
                key={tag}
                className="cursor-pointer rounded-md bg-gray-50 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

