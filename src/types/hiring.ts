export type ApplicationStatus =
  | 'NEW'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface HireCandidateRequest {
  applicationId: number
  note?: string
  salary?: number
  salaryCurrency?: string
  startDate?: string // ISO date string
  position?: string
  department?: string
  contractType?: string
  additionalBenefits?: string
  sendOfferEmail?: boolean
}

export interface HireCandidateResponse {
  applicationId: number
  candidateId: number
  candidateName: string
  candidateEmail: string
  jobId: number
  jobTitle: string
  previousStatus: ApplicationStatus
  newStatus: ApplicationStatus
  hiredAt: string
  hiredBy: string
  salary?: number
  salaryCurrency?: string
  startDate?: string
  position?: string
  department?: string
  contractType?: string
  message: string
  emailSent: boolean
}

export interface ApplicationStatusHistory {
  id: number
  applicationId: number
  previousStatus?: ApplicationStatus
  newStatus: ApplicationStatus
  changedById?: number
  changedByName?: string
  changedAt: string
  note?: string
  offerDetails?: string
}
