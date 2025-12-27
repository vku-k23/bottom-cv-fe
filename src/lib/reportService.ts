import { apiClient } from './api'

export interface Report {
  id: number
  resourceType: string
  resourceId: number
  reason: string
  description?: string
  reporterId: number
  reporterName?: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface ReportListResponse {
  data: Report[] // Backend returns 'data' not 'content'
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean // Backend returns 'isLast' not 'last'
}

export const reportService = {
  // Admin APIs
  async getAllReports(params?: {
    pageNo?: number
    pageSize?: number
    resolved?: boolean
  }): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.resolved !== undefined)
      queryParams.append('resolved', params.resolved.toString())

    return apiClient.get<ReportListResponse>(
      `/back/reports?${queryParams.toString()}`
    )
  },

  async getReportById(id: number): Promise<Report> {
    // Backend doesn't have getById endpoint, so we'll fetch from list and find
    // For now, return a mock - in production, backend should add this endpoint
    const response = await apiClient.get<ReportListResponse>(
      `/back/reports?pageNo=0&pageSize=1000`
    )
    const report = response.data.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    return report
  },

  async resolveReport(id: number): Promise<Report> {
    return apiClient.put<Report>(`/back/reports/${id}/resolve`)
  },
}
