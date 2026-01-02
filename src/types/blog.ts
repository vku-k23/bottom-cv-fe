export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface BlogAuthor {
  id: number
  username: string
  fullName?: string
  avatar?: string
}

export interface BlogCategory {
  id: number
  name: string
}

export interface Blog {
  id: number
  title: string
  slug: string
  thumbnail?: string
  content: string
  excerpt?: string
  status: BlogStatus
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  publishedAt?: string
  viewCount: number
  author: BlogAuthor
  category?: BlogCategory
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  data: Blog[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export interface BlogSearchParams {
  keyword?: string
  status?: BlogStatus
  categoryId?: number
  authorId?: number
  sortBy?: string
  sortDirection?: string
  page?: number
  size?: number
}

export interface BlogRequest {
  title: string
  slug?: string
  thumbnail?: string
  content: string
  excerpt?: string
  status?: BlogStatus
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  publishedAt?: string
  categoryId?: number
}

export interface BlogStats {
  publishedCount: number
  draftCount: number
}
