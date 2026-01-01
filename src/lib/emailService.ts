import { apiClient, ListResponse } from './api'
import {
  EmailTemplate,
  EmailLog,
  SendEmailRequest,
  RenderTemplateResponse,
} from '@/types/email'

export const emailService = {
  /**
   * Get available email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    return apiClient.get<EmailTemplate[]>('/admin/emails/templates')
  },

  /**
   * Get a specific template by ID
   */
  async getTemplateById(templateId: number): Promise<EmailTemplate> {
    return apiClient.get<EmailTemplate>(`/admin/emails/templates/${templateId}`)
  },

  /**
   * Render template with placeholders for an application
   */
  async renderTemplate(
    templateId: number,
    applicationId: number
  ): Promise<RenderTemplateResponse> {
    return apiClient.get<RenderTemplateResponse>(
      `/admin/emails/templates/${templateId}/render?applicationId=${applicationId}`
    )
  },

  /**
   * Send email to candidate
   */
  async sendEmail(request: SendEmailRequest): Promise<EmailLog> {
    return apiClient.post<EmailLog>('/admin/emails/send', request)
  },

  /**
   * Get email logs with pagination
   */
  async getEmailLogs(params?: {
    pageNo?: number
    pageSize?: number
    sortBy?: string
    sortType?: string
  }): Promise<ListResponse<EmailLog>> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortType) queryParams.append('sortType', params.sortType)

    const query = queryParams.toString()
    return apiClient.get<ListResponse<EmailLog>>(
      `/admin/emails/logs${query ? `?${query}` : ''}`
    )
  },

  /**
   * Get email logs for a specific application
   */
  async getEmailLogsByApplication(applicationId: number): Promise<EmailLog[]> {
    return apiClient.get<EmailLog[]>(
      `/admin/emails/logs/application/${applicationId}`
    )
  },

  /**
   * Retry a failed email
   */
  async retryEmail(emailLogId: number): Promise<EmailLog> {
    return apiClient.post<EmailLog>(
      `/admin/emails/logs/${emailLogId}/retry`,
      {}
    )
  },
}
