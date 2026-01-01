import { BlogDetailPage } from '@/components/blog/BlogDetailPage'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: _slug } = await params
  
  // In a real app, you'd fetch the blog data here for SEO
  // Using _slug prefix to indicate it's intentionally unused for now
  return {
    title: `Blog | BottomCV - Job Portal`,
    description: 'Read our latest blog post with career advice and industry insights.',
    openGraph: {
      title: 'Blog | BottomCV',
      description: 'Career advice and job search tips',
      type: 'article',
    },
  }
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params
  return <BlogDetailPage slug={slug} />
}

