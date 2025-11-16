import { apiClient } from './api'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryListResponse {
  data: Category[] // Backend returns 'data' not 'content'
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean // Backend returns 'isLast' not 'last'
}

export const categoryService = {
  // Admin APIs
  async getAllCategories(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
  }): Promise<CategoryListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    return apiClient.get<CategoryListResponse>(
      `/back/categories?${queryParams.toString()}`
    )
  },

  async getCategoryById(id: number): Promise<Category> {
    return apiClient.get<Category>(`/back/categories/${id}`)
  },

  async createCategory(data: {
    name: string
    slug: string
    description?: string
  }): Promise<Category> {
    return apiClient.post<Category>('/back/categories', data)
  },

  async updateCategory(
    id: number,
    data: { name: string; slug: string; description?: string }
  ): Promise<Category> {
    return apiClient.put<Category>(`/back/categories/${id}`, data)
  },

  async deleteCategory(id: number): Promise<void> {
    return apiClient.delete(`/back/categories/${id}`)
  },
}
