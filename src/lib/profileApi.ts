import { ProfileResponse, ProfileRequest } from '@/types/profile'
import { apiClient, API_ENDPOINTS } from './api'

export const profileApi = {
  // Get current user profile
  getProfile: async (): Promise<ProfileResponse> => {
    return apiClient.get<ProfileResponse>(API_ENDPOINTS.user.profile)
  },

  // Update current user profile
  updateProfile: async (data: ProfileRequest): Promise<ProfileResponse> => {
    return apiClient.post<ProfileResponse>(API_ENDPOINTS.user.profile, data)
  },

  // Upload profile avatar
  uploadAvatar: async (
    file: File
  ): Promise<{ success: boolean; fileUrl: string; objectName: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.postFormData(API_ENDPOINTS.upload.profileImage, formData)
  },
}
