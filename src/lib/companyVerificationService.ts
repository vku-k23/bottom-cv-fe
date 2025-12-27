import { apiClient } from './api'
import { Company } from './companyService'

export interface CompanyVerificationRequest {
  notes?: string
}

export const companyVerificationService = {
  async verifyCompany(
    id: number,
    request: CompanyVerificationRequest
  ): Promise<Company> {
    return apiClient.post<Company>(`/back/companies/${id}/verify`, request)
  },

  async rejectVerification(
    id: number,
    request: CompanyVerificationRequest
  ): Promise<Company> {
    return apiClient.post<Company>(
      `/back/companies/${id}/reject-verification`,
      request
    )
  },
}
