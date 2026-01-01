import { apiClient } from './api'
import {
  HireCandidateRequest,
  HireCandidateResponse,
  ApplicationStatusHistory,
} from '@/types/hiring'

export const hiringService = {
  /**
   * Hire a candidate
   */
  async hireCandidate(request: HireCandidateRequest): Promise<HireCandidateResponse> {
    return apiClient.post<HireCandidateResponse>('/admin/hiring/hire', request)
  },

  /**
   * Get application status history
   */
  async getApplicationStatusHistory(
    applicationId: number
  ): Promise<ApplicationStatusHistory[]> {
    return apiClient.get<ApplicationStatusHistory[]>(
      `/admin/hiring/applications/${applicationId}/history`
    )
  },

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: number,
    status: string,
    note?: string
  ): Promise<ApplicationStatusHistory> {
    const queryParams = new URLSearchParams()
    queryParams.append('status', status)
    if (note) queryParams.append('note', note)

    return apiClient.put<ApplicationStatusHistory>(
      `/admin/hiring/applications/${applicationId}/status?${queryParams.toString()}`,
      {}
    )
  },
}

