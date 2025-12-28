import { apiClient } from './api'

export interface ApplyResponse {
  id: number
  jobId: number
  userId: number
  cvUrl?: string
  coverLetter?: string
  status: string
  createdAt: string
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
}
