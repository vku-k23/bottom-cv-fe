import { apiClient } from './api'

export interface SystemConfig {
  id: number
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  logoUrl?: string
  faviconUrl?: string
  smtpHost?: string
  smtpPort?: number
  smtpUsername?: string
  featureFlags?: Record<string, boolean>
  passwordMinLength: number
  sessionTimeoutMinutes: number
  maxLoginAttempts: number
  maintenanceMode: boolean
  maintenanceMessage?: string
  updatedAt?: string
  updatedBy?: string
}

export interface SystemConfigRequest {
  siteName: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  logoUrl?: string
  faviconUrl?: string
  smtpHost?: string
  smtpPort?: number
  smtpUsername?: string
  smtpPassword?: string
  featureFlags?: Record<string, boolean>
  passwordMinLength?: number
  sessionTimeoutMinutes?: number
  maxLoginAttempts?: number
  maintenanceMode?: boolean
  maintenanceMessage?: string
}

export const systemConfigService = {
  // Get system configuration
  async getSystemConfig(): Promise<SystemConfig> {
    return apiClient.get<SystemConfig>('/back/system/config')
  },

  // Update system configuration
  async updateSystemConfig(
    request: SystemConfigRequest
  ): Promise<SystemConfig> {
    return apiClient.put<SystemConfig>('/back/system/config', request)
  },
}
