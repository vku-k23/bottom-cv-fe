'use client'

import Link from 'next/link'
import { Blog } from '@/types/blog'
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react'

interface BlogCardProps {
  blog: Blog
  isHighlighted?: boolean
}

export function BlogCard({ blog, isHighlighted = false }: BlogCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <article
      className={`group overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
        isHighlighted
          ? 'border-transparent shadow-lg ring-2 ring-blue-500/20'
          : 'border-gray-100 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">
        {/* Thumbnail */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-44 sm:w-80">
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-4xl text-blue-200">📝</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{blog.viewCount} Views</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/blogs/${blog.slug}`}>
            <h3
              className={`line-clamp-2 text-lg font-semibold transition-colors ${
                isHighlighted
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
            {blog.excerpt || blog.content.substring(0, 200).replace(/<[^>]*>/g, '')}...
          </p>

          {/* Read more link */}
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Read more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  )
}

