import { apiClient } from './api'

// Types for Admin Dashboard
export interface AdminStats {
  totalUsers: number
  totalCandidates: number
  totalEmployers: number
  totalCompanies: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingJobs: number
  pendingReports: number
  totalRevenue: number
  userGrowthRate: number
  jobGrowthRate: number
  applicationGrowthRate: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  newJobsToday: number
  newJobsThisWeek: number
  newJobsThisMonth: number
}

export interface ActivityLog {
  id: number
  activityType: string
  message: string
  userName: string
  userId?: number
  status: 'success' | 'warning' | 'info' | 'error'
  timestamp: string
  resourceType: string
  resourceId: number
}

export interface ChartData {
  data: Array<{
    label: string
    value: number
    category?: string
  }>
}

export const adminService = {
  // Dashboard statistics
  async getStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>('/back/admin/stats')
  },

  async getActivities(): Promise<ActivityLog[]> {
    return apiClient.get<ActivityLog[]>('/back/admin/activities')
  },

  async getUserGrowthChart(days: number = 30): Promise<ChartData> {
    return apiClient.get<ChartData>(
      `/back/admin/charts/user-growth?days=${days}`
    )
  },

  async getJobTrendChart(days: number = 30): Promise<ChartData> {
    return apiClient.get<ChartData>(`/back/admin/charts/job-trend?days=${days}`)
  },
}
