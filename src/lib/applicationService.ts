import { apiClient, ListResponse } from './api'

export interface ApplyResponse {
  id: number
  jobId: number
  userId: number
  cvId?: number
  cvUrl?: string
  coverLetter?: string
  status: string
  message?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export type ApplicationStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE'

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus
}

export interface ApplicationsGroupedByStatus {
  [key: string]: ApplyResponse[]
}

export const applicationService = {
  async submitApplication(data: {
    jobId: number
    coverLetter: string
    cvFile: File
  }): Promise<ApplyResponse> {
    const formData = new FormData()
    formData.append('jobId', data.jobId.toString())
    formData.append('coverLetter', data.coverLetter)
    formData.append('cvFile', data.cvFile)

    return apiClient.postFormData<ApplyResponse>('/applies/submit', formData)
  },

  async getApplicationsByJobId(
    jobId: number,
    params?: {
      pageNo?: number
      pageSize?: number
      sortBy?: string
      sortType?: string
    }
  ): Promise<ListResponse<ApplyResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    const query = queryParams.toString()
    return apiClient.get<ListResponse<ApplyResponse>>(
      `/applies/job/${jobId}${query ? `?${query}` : ''}`
    )
  },

  async getApplicationsByJobIdAndStatus(
    jobId: number,
    status: ApplicationStatus,
    params?: {
      pageNo?: number
      pageSize?: number
      sortBy?: string
      sortType?: string
    }
  ): Promise<ListResponse<ApplyResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    const query = queryParams.toString()
    return apiClient.get<ListResponse<ApplyResponse>>(
      `/applies/job/${jobId}/status/${status}${query ? `?${query}` : ''}`
    )
  },

  async getApplicationsGroupedByStatus(
    jobId: number
  ): Promise<ApplicationsGroupedByStatus> {
    return apiClient.get<ApplicationsGroupedByStatus>(
      `/applies/job/${jobId}/grouped-by-status`
    )
  },

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus
  ): Promise<ApplyResponse> {
    return apiClient.put<ApplyResponse>(`/applies/${applicationId}/status`, {
      status,
    })
  },

  async getAllApplications(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
  }): Promise<ListResponse<ApplyResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    const query = queryParams.toString()
    return apiClient.get<ListResponse<ApplyResponse>>(
      `/applies${query ? `?${query}` : ''}`
    )
  },
}
