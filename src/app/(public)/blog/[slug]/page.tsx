import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogDetailPage(props: any) {
  const { params } = props
  const post = {
    slug: params.slug,
    title: 'How to optimize your job search in 2025',
    category: 'Career',
    publishedAt: '2025-08-12',
    readTime: '8 min',
    tags: ['resume', 'interview', 'growth'],
    content: `## Introduction\nOptimizing your job search involves a combination of positioning, networking, and iteration.\n\n### 1. Position Your Profile\nRefine your headline, highlight quantified achievements, and tailor your skills.\n\n### 2. Target Strategically\nBuild a focused list of roles and companies. Use advanced search filters.\n\n### 3. Iterate Fast\nReview response rates weekly and adjust resume & outreach.\n\n### Conclusion\nConsistency plus feedback loops compound over time.`,
  }
  const related = Array.from({ length: 3 }).map((_, i) => ({
    slug: 'related-' + (i + 1),
    title: `Related article #${i + 1}`,
    publishedAt: '2025-08-0' + (i + 3),
  }))

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/blog"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to Blog
      </Link>
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <Badge variant="neutral">{post.category}</Badge>
          <span>{post.publishedAt}</span>
          <span>• {post.readTime}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </header>
      <div className="prose prose-sm prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed mt-8 max-w-none">
        {post.content.split('\n\n').map((block, i) => {
          if (block.startsWith('## ')) {
            return <h2 key={i}>{block.replace('## ', '')}</h2>
          }
          if (block.startsWith('### ')) {
            return <h3 key={i}>{block.replace('### ', '')}</h3>
          }
          return <p key={i}>{block}</p>
        })}
      </div>
      <hr className="my-12 border-gray-200" />
      <section>
        <h2 className="mb-4 text-lg font-semibold text-black">
          Related Articles
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm transition hover:shadow-md"
            >
              <div className="text-xs text-gray-500">{r.publishedAt}</div>
              <h3 className="mt-2 line-clamp-2 font-medium text-gray-800 group-hover:text-blue-600">
                {r.title}
              </h3>
              <span className="mt-3 inline-block text-xs font-medium text-blue-600 group-hover:underline">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
