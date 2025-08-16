'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const makePosts = () =>
  Array.from({ length: 9 }).map((_, i) => {
    const day = String(i + 1).padStart(2, '0')
    return {
      slug: 'post-' + (i + 1),
      title: `How to improve your job search #${i + 1}`,
      excerpt:
        'Actionable strategies to optimize your profile, tailor applications, and stand out to recruiters.',
      category: ['Career', 'Guides', 'Product'][i % 3],
      publishedAt: `2025-08-${day}`,
      readTime: `${5 + (i % 4) * 2} min`,
      tags: ['resume', 'interview', 'growth'].slice(0, (i % 3) + 1),
    }
  })

export default function BlogPage() {
  const posts = makePosts()
  const categories = ['All', 'Career', 'Guides', 'Product']
  const [activeCat, setActiveCat] = useState('All')
  const [keyword, setKeyword] = useState('')
  const [loading] = useState(false)
  // simulate loading in future via useEffect

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const catOk = activeCat === 'All' || p.category === activeCat
      const k = keyword.trim().toLowerCase()
      const kwOk =
        !k ||
        p.title.toLowerCase().includes(k) ||
        p.excerpt.toLowerCase().includes(k)
      return catOk && kwOk
    })
  }, [posts, activeCat, keyword])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Blog</h1>
          <p className="mt-2 text-sm text-gray-600">
            Insights, guides & product updates for job seekers and employers.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search articles..."
            className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <Tabs value={activeCat} onValueChange={setActiveCat}>
        <TabsList>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeCat}>
          {loading ? (
            <div
              className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              aria-live="polite"
              aria-busy="true"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-3 w-20 rounded" />
                    <div className="skeleton h-3 w-10 rounded" />
                  </div>
                  <div className="skeleton mt-4 h-4 w-3/4 rounded" />
                  <div className="skeleton mt-2 h-4 w-2/3 rounded" />
                  <div className="mt-4 flex gap-2">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-5 w-12 rounded-full" />
                  </div>
                  <div className="skeleton mt-auto h-4 w-24 rounded pt-6" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                aria-live="polite"
              >
                {filtered.map((p) => (
                  <article
                    key={p.slug}
                    className="group flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    aria-label={p.title}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{p.publishedAt}</span>
                      <span>• {p.readTime}</span>
                    </div>
                    <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-black group-hover:text-blue-600">
                      {p.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {p.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="neutral">{p.category}</Badge>
                      {p.tags.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="mt-12 rounded-md border border-dashed border-gray-300 p-10 text-center text-sm text-gray-600">
                  No posts match your filters.
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
