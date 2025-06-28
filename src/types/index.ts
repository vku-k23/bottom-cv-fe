// Core Types
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'

// Job Types
export interface Job {
  id: string
  title: string
  slug: string
  description: string
  requirements: string
  responsibilities?: string
  benefits?: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  type: JobType
  workLocation: WorkLocation
  location?: string
  remote: boolean
  experienceLevel?: string
  status: JobStatus
  featured: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  company: Company
  author: User
  applications?: Application[]
  savedBy?: SavedJob[]
  skills?: JobSkill[]
  tags?: JobTag[]
  _count?: {
    applications: number
    savedBy: number
  }
}

export type JobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'FREELANCE'
  | 'INTERNSHIP'
export type WorkLocation = 'REMOTE' | 'ONSITE' | 'HYBRID'
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'EXPIRED'

// Company Types
export interface Company {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  logo?: string
  size?: string
  industry?: string
  location?: string
  founded?: number
  createdAt: Date
  updatedAt: Date
  user: User
  jobs?: Job[]
  _count?: {
    jobs: number
  }
}

// Profile Types
export interface JobSeekerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  location?: string
  summary?: string
  resume?: string
  portfolio?: string
  linkedIn?: string
  github?: string
  website?: string
  salaryMin?: number
  salaryMax?: number
  isOpenToWork: boolean
  createdAt: Date
  updatedAt: Date
  user: User
  experiences?: WorkExperience[]
  educations?: Education[]
  skills?: ProfileSkill[]
  certificates?: Certificate[]
}

export interface WorkExperience {
  id: string
  profileId: string
  title: string
  company: string
  location?: string
  startDate: Date
  endDate?: Date
  current: boolean
  description?: string
}

export interface Education {
  id: string
  profileId: string
  institution: string
  degree: string
  field?: string
  startDate: Date
  endDate?: Date
  current: boolean
  gpa?: number
  description?: string
}

export interface Certificate {
  id: string
  profileId: string
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialId?: string
  credentialUrl?: string
}

// Application Types
export interface Application {
  id: string
  coverLetter?: string
  resume?: string
  status: ApplicationStatus
  appliedAt: Date
  updatedAt: Date
  reviewedAt?: Date
  interviewAt?: Date
  rejectedAt?: Date
  withdrawnAt?: Date
  job: Job
  applicant: User
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'HIRED'

// Skill Types
export interface Skill {
  id: string
  name: string
  category?: string
  description?: string
  createdAt: Date
}

export interface ProfileSkill {
  id: string
  profileId: string
  skillId: string
  proficiency: number
  yearsOfExp?: number
  skill: Skill
}

export interface JobSkill {
  id: string
  jobId: string
  skillId: string
  required: boolean
  weight: number
  skill: Skill
}

// Utility Types
export interface SavedJob {
  id: string
  userId: string
  jobId: string
  savedAt: Date
  user: User
  job: Job
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface JobTag {
  id: string
  jobId: string
  tagId: string
  tag: Tag
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, unknown>
  createdAt: Date
}

export type NotificationType =
  | 'APPLICATION_UPDATE'
  | 'NEW_JOB_MATCH'
  | 'MESSAGE'
  | 'SYSTEM'

export interface Message {
  id: string
  senderId: string
  receiverId: string
  subject: string
  content: string
  read: boolean
  createdAt: Date
  sender: User
  receiver: User
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Search Types
export interface JobSearchParams {
  query?: string
  location?: string
  type?: JobType
  workLocation?: WorkLocation
  salaryMin?: number
  salaryMax?: number
  experienceLevel?: string
  skills?: string[]
  companySize?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'salary' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

export interface JobFilters {
  types: JobType[]
  workLocations: WorkLocation[]
  experienceLevels: string[]
  salaryRanges: { min: number; max: number; label: string }[]
  companySizes: string[]
  skills: Skill[]
}

// Form Types
export interface CreateJobForm {
  title: string
  description: string
  requirements: string
  responsibilities?: string
  benefits?: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  type: JobType
  workLocation: WorkLocation
  location?: string
  remote: boolean
  experienceLevel?: string
  expiresAt?: Date
  skills: string[]
  tags: string[]
}

export interface ProfileForm {
  firstName: string
  lastName: string
  phone?: string
  location?: string
  summary?: string
  resume?: string
  portfolio?: string
  linkedIn?: string
  github?: string
  website?: string
  salaryMin?: number
  salaryMax?: number
  isOpenToWork: boolean
}

export interface CompanyForm {
  name: string
  description?: string
  website?: string
  size?: string
  industry?: string
  location?: string
  founded?: number
}

// Dashboard Types
export interface DashboardStats {
  totalJobs: number
  totalApplications: number
  totalViews: number
  activeJobs: number
  pendingApplications: number
  scheduledInterviews: number
}

export interface ApplicationStats {
  total: number
  applied: number
  screening: number
  interviewing: number
  offered: number
  rejected: number
  hired: number
}

// Chart Types
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}
