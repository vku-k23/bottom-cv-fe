import { apiClient } from './api'

export interface StatusColumnResponse {
  id: number
  name: string
  code: string
  displayOrder: number
  isDefault: boolean
  jobId?: number | null
  createdAt: string
  updatedAt?: string
}

export interface CreateStatusColumnRequest {
  name: string
  jobId?: number | null
}

export interface UpdateStatusColumnRequest {
  name?: string
  displayOrder?: number
}

export const statusColumnService = {
  async getAllStatusColumns(jobId?: number): Promise<StatusColumnResponse[]> {
    const query = jobId ? `?jobId=${jobId}` : ''
    return apiClient.get<StatusColumnResponse[]>(`/status-columns${query}`)
  },

  async getStatusColumnById(id: number): Promise<StatusColumnResponse> {
    return apiClient.get<StatusColumnResponse>(`/status-columns/${id}`)
  },

  async createStatusColumn(
    request: CreateStatusColumnRequest
  ): Promise<StatusColumnResponse> {
    return apiClient.post<StatusColumnResponse>('/status-columns', request)
  },

  async updateStatusColumn(
    id: number,
    request: UpdateStatusColumnRequest
  ): Promise<StatusColumnResponse> {
    return apiClient.put<StatusColumnResponse>(`/status-columns/${id}`, request)
  },

  async deleteStatusColumn(id: number): Promise<void> {
    return apiClient.delete(`/status-columns/${id}`)
  },
}
