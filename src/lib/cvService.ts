import { apiClient, API_ENDPOINTS } from './api'
import { CVResponse, CVListResponse, CVRequest } from '@/types/cv'

export const cvService = {
  // Get all CVs for current user
  async getMyCVs(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
  }): Promise<CVListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.pageNo !== undefined)
      searchParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      searchParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortType) searchParams.append('sortType', params.sortType)

    const endpoint = `${API_ENDPOINTS.cv.list}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return apiClient.get<CVListResponse>(endpoint)
  },

  // Get CV by ID
  async getCVById(id: number): Promise<CVResponse> {
    return apiClient.get<CVResponse>(API_ENDPOINTS.cv.get(id))
  },

  // Create new CV
  async createCV(cvData: CVRequest): Promise<CVResponse> {
    const formData = new FormData()
    formData.append('title', cvData.title)
    formData.append('cvFile', cvData.cvFile)
    formData.append('skills', cvData.skills || '')
    formData.append('experience', cvData.experience || '')
    formData.append('content', cvData.content || '')

    return apiClient.postFormData<CVResponse>(API_ENDPOINTS.cv.create, formData)
  },

  // Update CV
  async updateCV(id: number, cvData: CVRequest): Promise<CVResponse> {
    const formData = new FormData()
    formData.append('title', cvData.title)
    formData.append('cvFile', cvData.cvFile)
    formData.append('skills', cvData.skills || '')
    formData.append('experience', cvData.experience || '')
    formData.append('content', cvData.content || '')

    return apiClient.putFormData<CVResponse>(
      API_ENDPOINTS.cv.update(id),
      formData
    )
  },

  // Delete CV
  async deleteCV(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.cv.delete(id))
  },

  // Download CV file
  // cvFile should be the objectName (e.g., "applications/123/filename.pdf")
  async downloadCV(cvFile: string): Promise<Blob> {
    try {
      // First, try to get presigned URL (this is more reliable)
      // Note: Spring path variable {objectName:.+} matches everything after /url/
      // So we need to encode the entire objectName, but keep slashes
      const urlResponse = await apiClient.get<{
        success: boolean
        fileUrl: string
      }>(`/files/url/${cvFile.split('/').map(encodeURIComponent).join('/')}`)

      if (urlResponse.success && urlResponse.fileUrl) {
        // Use presigned URL to download (no auth needed for presigned URL)
        const response = await fetch(urlResponse.fileUrl)
        if (!response.ok) {
          throw new Error(
            `Failed to download CV file from presigned URL: ${response.status}`
          )
        }
        return response.blob()
      }

      throw new Error('Failed to get presigned URL for CV file')
    } catch (error) {
      console.error('Error downloading CV:', error)
      // If presigned URL fails, try direct download as fallback
      try {
        const encodedObjectName = cvFile
          .split('/')
          .map(encodeURIComponent)
          .join('/')
        const response = await fetch(
          `${apiClient['baseURL']}/files/download/${encodedObjectName}`,
          {
            headers: {
              Authorization: `Bearer ${apiClient['token']}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(
            `Failed to download CV file: ${response.status} ${response.statusText}`
          )
        }

        return response.blob()
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError)
        throw error // Throw original error
      }
    }
  },
}
