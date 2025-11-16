import { apiClient } from './api'
import type { PaginatedResponse } from './userManagementService'

export interface ModerationQueueItem {
  id: number
  title: string
  companyName: string
  companyId: number
  location: string
  salary: number
  status: string
  jobType: string
  submittedAt: string
  submittedBy: string
  submittedById: number
  reportCount: number
}

export interface ModerationRequest {
  reason?: string
}

export interface BulkModerationRequest {
  jobIds: number[]
  reason?: string
}

export interface JobResponse {
  id: number
  title: string
  jobDescription: string
  status: string
}

export const moderationService = {
  // Get moderation queue
  async getModerationQueue(
    status?: string,
    pageNo: number = 0,
    pageSize: number = 10
  ): Promise<PaginatedResponse<ModerationQueueItem>> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('pageNo', pageNo.toString())
    params.append('pageSize', pageSize.toString())

    return apiClient.get<PaginatedResponse<ModerationQueueItem>>(
      `/back/moderation/jobs/queue?${params.toString()}`
    )
  },

  // Approve job
  async approveJob(
    id: number,
    request?: ModerationRequest
  ): Promise<JobResponse> {
    return apiClient.post<JobResponse>(
      `/back/moderation/jobs/${id}/approve`,
      request || {}
    )
  },

  // Reject job
  async rejectJob(
    id: number,
    request: ModerationRequest
  ): Promise<JobResponse> {
    return apiClient.post<JobResponse>(
      `/back/moderation/jobs/${id}/reject`,
      request
    )
  },

  // Bulk approve jobs
  async bulkApproveJobs(request: BulkModerationRequest): Promise<void> {
    return apiClient.post<void>('/back/moderation/jobs/bulk-approve', request)
  },

  // Bulk reject jobs
  async bulkRejectJobs(request: BulkModerationRequest): Promise<void> {
    return apiClient.post<void>('/back/moderation/jobs/bulk-reject', request)
  },

  // Approve review
  async approveReview(id: number): Promise<void> {
    return apiClient.post<void>(`/back/moderation/reviews/${id}/approve`, {})
  },

  // Reject review
  async rejectReview(id: number, reason?: string): Promise<void> {
    return apiClient.post<void>(`/back/moderation/reviews/${id}/reject`, reason)
  },
}
