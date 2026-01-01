export type EmailTemplateType = 'INTERVIEW' | 'OFFER' | 'REJECTION' | 'CUSTOM'

export type EmailStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED'

export interface EmailTemplate {
  id: number
  name: string
  type: EmailTemplateType
  subject: string
  content: string
  description?: string
  isActive: boolean
  companyId?: number
  companyName?: string
  createdAt: string
  updatedAt?: string
}

export interface EmailLog {
  id: number
  senderId?: number
  senderName?: string
  senderEmail: string
  receiverEmail: string
  ccEmails?: string[]
  bccEmails?: string[]
  subject: string
  content: string
  templateType?: EmailTemplateType
  templateId?: number
  templateName?: string
  applicationId?: number
  candidateId?: number
  candidateName?: string
  jobId?: number
  jobTitle?: string
  status: EmailStatus
  sentAt?: string
  errorMessage?: string
  attachmentUrls?: string[]
  createdAt: string
}

export interface SendEmailRequest {
  to: string
  cc?: string[]
  bcc?: string[]
  subject: string
  content: string
  templateType: EmailTemplateType
  templateId?: number
  applicationId: number
  attachmentUrls?: string[]
}

export interface RenderTemplateResponse {
  subject: string
  content: string
  templateId: string
  templateName: string
}

