'use client'

import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/lib/blogService'
import { BlogCard } from './BlogCard'
import { BlogSidebar } from './BlogSidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function BlogsPage() {
  const [page, setPage] = useState(0)
  const [pageSize] = useState(8)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()

  // Fetch published blogs
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-blogs', page, pageSize, searchKeyword, selectedCategoryId],
    queryFn: () =>
      blogService.getPublishedBlogs({
        page,
        size: pageSize,
        keyword: searchKeyword || undefined,
        categoryId: selectedCategoryId,
        sortBy: 'publishedAt',
        sortDirection: 'desc',
      }),
  })

  const blogs = data?.data || []
  const totalPages = data?.totalPages || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Blog</h1>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Blog</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="order-2 w-full lg:order-1 lg:w-80 lg:shrink-0">
            <BlogSidebar
              searchKeyword={searchKeyword}
              onSearchChange={(keyword) => {
                setSearchKeyword(keyword)
                setPage(0)
              }}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={(categoryId) => {
                setSelectedCategoryId(categoryId)
                setPage(0)
              }}
            />
          </aside>

          {/* Blog List */}
          <main className="order-1 flex-1 lg:order-2">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-red-500">Error loading blogs</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white">
                <span className="text-4xl">📝</span>
                <p className="text-gray-500">No blogs found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    isHighlighted={index === 1}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-12 w-12 rounded-full border-blue-100 bg-blue-50 p-0 text-blue-600 hover:bg-blue-100"
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
                        className={`h-12 w-12 rounded-full ${
                          isActive
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
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
                  className="h-12 w-12 rounded-full border-blue-100 bg-blue-50 p-0 text-blue-600 hover:bg-blue-100"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

