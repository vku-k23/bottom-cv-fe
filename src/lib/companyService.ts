import { apiClient } from './api'

export interface Company {
  id: number
  name: string
  slug: string
  introduce?: string
  socialMediaLinks?: Record<string, string>
  addresses?: Record<string, string>
  phone?: string
  email?: string
  website?: string
  logo?: string
  cover?: string
  industry: string
  companySize: string
  foundedYear?: number
  verified: boolean | null
  verificationNotes?: string
  verificationDate?: string
  verifiedBy?: string
  createdAt?: string
  updatedAt?: string
  jobCount?: number
  jobs?: Array<{
    id: number
    title: string
    [key: string]: unknown
  }>
}

export interface CompanyListResponse {
  data: Company[] // Backend returns 'data' not 'content'
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean // Backend returns 'isLast' not 'last'
}

export const companyService = {
  // Admin APIs
  async getAllCompanies(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
    search?: string
    industry?: string
    verified?: boolean
  }): Promise<CompanyListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.industry) queryParams.append('industry', params.industry)
    if (params?.verified !== undefined)
      queryParams.append('verified', params.verified.toString())

    return apiClient.get<CompanyListResponse>(
      `/back/companies?${queryParams.toString()}`
    )
  },

  async getCompanyById(id: number): Promise<Company> {
    return apiClient.get<Company>(`/back/companies/${id}`)
  },

  async updateCompany(id: number, data: Partial<Company>): Promise<Company> {
    return apiClient.put<Company>(`/back/companies/${id}`, data)
  },

  async createCompany(data: Partial<Company>): Promise<Company> {
    return apiClient.post<Company>('/back/companies', data)
  },

  async deleteCompany(id: number): Promise<void> {
    return apiClient.delete(`/back/companies/${id}`)
  },
}
