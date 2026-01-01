'use client'

import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/lib/blogService'
import { Blog } from '@/types/blog'
import { BlogSidebar } from './BlogSidebar'
import Link from 'next/link'
import {
  Home,
  Calendar,
  MessageCircle,
  Facebook,
  Twitter,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'

interface BlogDetailPageProps {
  slug: string
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()

  // Fetch blog by slug
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['public-blog', slug],
    queryFn: () => blogService.getPublishedBlogBySlug(slug),
  })

  // Fetch related blogs
  const { data: relatedBlogs } = useQuery({
    queryKey: ['related-blogs', blog?.id],
    queryFn: () => blogService.getRelatedBlogs(blog!.id),
    enabled: !!blog?.id,
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <span className="text-6xl">📝</span>
        <h1 className="text-2xl font-semibold text-gray-900">Blog Not Found</h1>
        <p className="text-gray-500">
          The blog you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/blogs"
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Single</h1>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs" className="text-gray-500 hover:text-gray-700">
              Blog List
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Blog Single</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Article */}
          <main className="flex-1">
            <article className="space-y-8">
              {/* Hero Image */}
              {blog.thumbnail && (
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-96 w-full object-cover"
                  />
                </div>
              )}

              {/* Article Header */}
              <header className="space-y-6">
                <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  {blog.title}
                </h1>

                {/* Author and Meta */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      {blog.author.avatar ? (
                        <img
                          src={blog.author.avatar}
                          alt={blog.author.fullName || blog.author.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                          {(blog.author.fullName || blog.author.username)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700">
                      {blog.author.fullName || blog.author.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MessageCircle className="h-5 w-5" />
                    <span>{blog.viewCount} Views</span>
                  </div>
                </div>
              </header>

              {/* Lead Text */}
              {blog.excerpt && (
                <p className="text-xl leading-relaxed text-gray-700">
                  {blog.excerpt}
                </p>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-800"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Share Section */}
              <div className="flex items-center gap-5 border-t border-gray-100 pt-8">
                <span className="font-medium text-gray-900">
                  Share this post:
                </span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </button>
                  <button className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm text-sky-500 transition-colors hover:bg-sky-50">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </button>
                </div>
              </div>
            </article>

            {/* Related Blogs */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <section className="mt-16 border-t border-gray-100 pt-12">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Related Blog
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedBlogs.map((relatedBlog) => (
                    <RelatedBlogCard key={relatedBlog.id} blog={relatedBlog} />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="sticky top-8">
              <BlogSidebar
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function RelatedBlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-md">
      {/* Thumbnail */}
      <div className="h-44 overflow-hidden bg-gray-100">
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <span className="text-4xl">📝</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600">
            {blog.title}
          </h3>
        </Link>

        <p className="line-clamp-3 text-sm text-gray-500">
          {blog.excerpt || blog.content.substring(0, 150).replace(/<[^>]*>/g, '')}
          ...
        </p>

        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

