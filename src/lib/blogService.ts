import { apiClient } from './api'
import {
  Blog,
  BlogListResponse,
  BlogRequest,
  BlogSearchParams,
  BlogStats,
} from '@/types/blog'

export const blogService = {
  // ==================== Admin APIs (ADMIN only) ====================

  async createBlog(data: BlogRequest): Promise<Blog> {
    return apiClient.post<Blog>('/back/blogs', data)
  },

  async updateBlog(id: number, data: BlogRequest): Promise<Blog> {
    return apiClient.put<Blog>(`/back/blogs/${id}`, data)
  },

  async deleteBlog(id: number): Promise<void> {
    return apiClient.delete(`/back/blogs/${id}`)
  },

  async getBlogById(id: number): Promise<Blog> {
    return apiClient.get<Blog>(`/back/blogs/${id}`)
  },

  async getAllBlogs(params?: BlogSearchParams): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.keyword) queryParams.append('keyword', params.keyword)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.categoryId)
      queryParams.append('categoryId', params.categoryId.toString())
    if (params?.authorId)
      queryParams.append('authorId', params.authorId.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDirection)
      queryParams.append('sortDirection', params.sortDirection)
    if (params?.page !== undefined)
      queryParams.append('page', params.page.toString())
    if (params?.size !== undefined)
      queryParams.append('size', params.size.toString())

    const queryString = queryParams.toString()
    return apiClient.get<BlogListResponse>(
      `/back/blogs${queryString ? `?${queryString}` : ''}`
    )
  },

  async getBlogStats(): Promise<BlogStats> {
    return apiClient.get<BlogStats>('/back/blogs/stats')
  },

  // ==================== Public APIs (for all users including guests) ====================

  async getPublishedBlogBySlug(slug: string): Promise<Blog> {
    return apiClient.get<Blog>(`/front/blogs/${slug}`)
  },

  async getPublishedBlogs(params?: BlogSearchParams): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.keyword) queryParams.append('keyword', params.keyword)
    if (params?.categoryId)
      queryParams.append('categoryId', params.categoryId.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortDirection)
      queryParams.append('sortDirection', params.sortDirection)
    if (params?.page !== undefined)
      queryParams.append('page', params.page.toString())
    if (params?.size !== undefined)
      queryParams.append('size', params.size.toString())

    const queryString = queryParams.toString()
    return apiClient.get<BlogListResponse>(
      `/front/blogs${queryString ? `?${queryString}` : ''}`
    )
  },

  async getRecentBlogs(): Promise<Blog[]> {
    return apiClient.get<Blog[]>('/front/blogs/recent')
  },

  async getRelatedBlogs(blogId: number): Promise<Blog[]> {
    return apiClient.get<Blog[]>(`/front/blogs/${blogId}/related`)
  },
}

