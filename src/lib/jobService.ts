import { apiClient } from './api'

export interface Job {
  id: number
  title: string
  jobDescription: string
  jobRequirement: string
  jobBenefit: string
  jobType: string | { displayName?: string; name?: string } // Backend returns JobType enum
  location: string
  latitude?: number
  longitude?: number
  workTime?: string
  salary?: number
  careerLevel?: string
  qualification?: string
  experience?: string
  expiryDate?: string
  status: string | { displayName?: string; name?: string } // Backend returns StatusJob enum
  company?: {
    id: number
    name: string
    logo?: string
  }
  companyId?: number
  categories?: Array<{
    id: number
    name: string
  }>
  categoryIds?: number[]
  createdAt?: string
  updatedAt?: string
  applicationCount?: number
}

export interface JobListResponse {
  data: Job[] // Backend returns 'data' not 'content'
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean // Backend returns 'isLast' not 'last'
}

export interface JobSearchParams {
  pageNo?: number
  pageSize?: number
  sortBy?: string
  sortType?: string
  search?: string
  jobType?: string
  location?: string
  status?: string
  companyId?: number
  categoryId?: number
}

export const jobService = {
  // Admin APIs
  async getAllJobs(params?: JobSearchParams): Promise<JobListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.jobType) queryParams.append('jobType', params.jobType)
    if (params?.location) queryParams.append('location', params.location)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.companyId)
      queryParams.append('companyId', params.companyId.toString())
    if (params?.categoryId)
      queryParams.append('categoryId', params.categoryId.toString())

    return apiClient.get<JobListResponse>(
      `/back/jobs?${queryParams.toString()}`
    )
  },

  async getJobById(id: number): Promise<Job> {
    return apiClient.get<Job>(`/back/jobs/${id}`)
  },

  async createJob(data: Partial<Job>): Promise<Job> {
    return apiClient.post<Job>('/back/jobs', data)
  },

  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    return apiClient.put<Job>(`/back/jobs/${id}`, data)
  },

  async deleteJob(id: number): Promise<void> {
    return apiClient.delete(`/back/jobs/${id}`)
  },
}
