import { apiClient, ListResponse } from './api'

export interface ApplyResponse {
  id: number
  jobId: number
  userId: number
  cvId?: number
  cvUrl?: string
  coverLetter?: string
  status: string
  position?: number // Position within the status column
  message?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export type ApplicationStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE'

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus
  position?: number // Optional position within the status column
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
    status: ApplicationStatus,
    position?: number
  ): Promise<ApplyResponse> {
    return apiClient.put<ApplyResponse>(`/applies/${applicationId}/status`, {
      status,
      position,
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

  async downloadApplicationCV(applicationId: number): Promise<Blob> {
    // Use apiClient's internal method to get baseURL and token
    const baseURL =
      (apiClient as unknown as { baseURL: string }).baseURL ||
      'http://localhost:8088/api/v1'
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null

    const response = await fetch(
      `${baseURL}/applies/${applicationId}/cv/download`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to download CV: ${response.status} ${response.statusText}`
      )
    }

    return response.blob()
  },
}
