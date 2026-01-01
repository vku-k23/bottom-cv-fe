import { apiClient, ListResponse } from './api'
import { applicationService, ApplyResponse } from './applicationService'

export interface SaveCandidateRequest {
  candidateId: number
  jobId: number
  note?: string
}

export interface SavedCandidateResponse {
  id: number
  candidateId: number
  candidateName: string
  candidateEmail?: string
  candidatePhone?: string
  candidateAvatar?: string
  candidateAddress?: string
  jobId?: number
  jobTitle?: string
  note?: string
  savedAt: string
}

export interface ToggleSaveResponse {
  saved: boolean
  message: string
  data: SavedCandidateResponse | Record<string, never>
}

export interface SendMailRequest {
  email: string
  subject: string
  message: string
}

export const candidateService = {
  /**
   * Toggle save/unsave a candidate (uses real API)
   */
  async toggleSaveCandidate(
    candidateId: number,
    jobId: number,
    note?: string
  ): Promise<ToggleSaveResponse> {
    return apiClient.post<ToggleSaveResponse>(
      '/admin/saved-candidates/toggle',
      {
        candidateId,
        jobId,
        note,
      }
    )
  },

  /**
   * Save a candidate (uses real API)
   */
  async saveCandidate(
    candidateId: number,
    jobId: number,
    note?: string
  ): Promise<{ saved: boolean; message: string }> {
    const response = await this.toggleSaveCandidate(candidateId, jobId, note)
    return {
      saved: response.saved,
      message: response.message,
    }
  },

  /**
   * Remove a saved candidate by ID
   */
  async removeSavedCandidate(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      `/admin/saved-candidates/${id}`
    )
  },

  /**
   * Remove a saved candidate by candidate ID and job ID
   */
  async removeSavedCandidateByIds(
    candidateId: number,
    jobId: number
  ): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      `/admin/saved-candidates/candidate/${candidateId}/job/${jobId}`
    )
  },

  /**
   * Get all saved candidates for the current employer
   */
  async getSavedCandidates(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
  }): Promise<ListResponse<SavedCandidateResponse>> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    const query = queryParams.toString()
    return apiClient.get<ListResponse<SavedCandidateResponse>>(
      `/admin/saved-candidates${query ? `?${query}` : ''}`
    )
  },

  /**
   * Check if a candidate is saved (uses real API)
   */
  async checkCandidateSaved(
    candidateId: number,
    jobId: number
  ): Promise<boolean> {
    try {
      const response = await apiClient.get<{ saved: boolean }>(
        `/admin/saved-candidates/check?candidateId=${candidateId}&jobId=${jobId}`
      )
      return response.saved
    } catch {
      return false
    }
  },

  /**
   * Check if candidate is saved (sync version, checks localStorage cache then API)
   * Note: For immediate UI updates, the CandidateProfileModal now uses checkCandidateSaved
   */
  isCandidateSaved(_candidateId: number, _jobId: number): boolean {
    // This sync version is deprecated - use checkCandidateSaved instead
    // Keeping for backward compatibility, always returns false
    return false
  },

  /**
   * Send email to candidate
   * Uses mailto link to open email client
   */
  async sendMailToCandidate(
    email: string,
    subject: string,
    message: string
  ): Promise<{ success: boolean; message: string }> {
    if (!email) {
      throw new Error('Candidate email not found')
    }

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoLink
    return { success: true, message: 'Email client opened' }
  },

  /**
   * Hire candidate by updating application status
   * Uses existing updateApplicationStatus API
   */
  async hireCandidate(applicationId: number): Promise<ApplyResponse> {
    // Use ACTIVE status to indicate hiring (or we could use a custom status if backend supports it)
    return applicationService.updateApplicationStatus(applicationId, 'ACTIVE')
  },
}
