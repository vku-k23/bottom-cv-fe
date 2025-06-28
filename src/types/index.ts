import { ReactNode } from 'react'

// Enums
export enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  USER = 'USER',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

// Core Types
export interface User {
  id: number
  email: string
  passwordHash: string
  fullName?: string | null
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: Date | null
  role: Role
  avatar?: string | null
  isEmailVerified: boolean
  emailVerificationToken?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: Date | null
  refreshToken?: string | null
  refreshTokenExpiry?: Date | null
  lastLogin?: Date | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  profile?: Profile | null
  jobs?: Job[]
  applications?: Application[]
  companies?: Company[]
  savedJobs?: SavedJob[]
  notifications?: Notification[]
  sentMessages?: Message[]
  receivedMessages?: Message[]
  auditLogs?: AuditLog[]
}

export interface Profile {
  id: number
  userId: number
  summary?: string | null
  skills: string[]
  experienceLevel: ExperienceLevel
  portfolio?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  websiteUrl?: string | null
  location?: string | null
  preferredSalary?: number | null
  isOpenToWork: boolean
  resumeUrl?: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
  experiences?: Experience[]
  educations?: Education[]
  userSkills?: UserSkill[]
}

export interface Company {
  id: number
  name: string
  description?: string | null
  industry?: string | null
  size?: string | null
  website?: string | null
  logo?: string | null
  location?: string | null
  foundedYear?: number | null
  createdById: number
  createdAt: Date
  updatedAt: Date

  // Relations
  createdBy: User
  jobs?: Job[]
}

export interface Job {
  id: number
  title: string
  slug: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salaryMin?: number | null
  salaryMax?: number | null
  currency: string
  location?: string | null
  isRemote: boolean
  jobType: JobType
  experienceLevel: ExperienceLevel
  status: JobStatus
  applicationDeadline?: Date | null
  postedById: number
  companyId: number
  viewCount: number
  createdAt: Date
  updatedAt: Date

  // Relations
  postedBy: User
  company: Company
  applications?: Application[]
  savedBy?: SavedJob[]
  jobSkills?: JobSkill[]
}

export interface Application {
  id: number
  jobId: number
  applicantId: number
  coverLetter?: string | null
  resumeUrl?: string | null
  status: ApplicationStatus
  appliedAt: Date
  reviewedAt?: Date | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  job: Job
  applicant: User
}

export interface Experience {
  id: number
  profileId: number
  jobTitle: string
  company: string
  location?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
  description?: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  profile: Profile
}

export interface Education {
  id: number
  profileId: number
  institution: string
  degree: string
  fieldOfStudy?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
  grade?: string | null
  description?: string | null
  educationLevel: EducationLevel
  createdAt: Date
  updatedAt: Date

  // Relations
  profile: Profile
}

export interface Skill {
  id: number
  name: string
  category?: string | null
  createdAt: Date
  updatedAt: Date

  // Relations
  userSkills?: UserSkill[]
  jobSkills?: JobSkill[]
}

export interface UserSkill {
  id: number
  profileId: number
  skillId: number
  level: SkillLevel
  yearsOfExperience?: number | null
  createdAt: Date
  updatedAt: Date

  // Relations
  profile: Profile
  skill: Skill
}

export interface JobSkill {
  id: number
  jobId: number
  skillId: number
  isRequired: boolean
  experienceYears?: number | null
  createdAt: Date
  updatedAt: Date

  // Relations
  job: Job
  skill: Skill
}

export interface SavedJob {
  id: number
  userId: number
  jobId: number
  savedAt: Date

  // Relations
  user: User
  job: Job
}

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: string
  isRead: boolean
  data?: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  subject: string
  content: string
  isRead: boolean
  parentMessageId?: number | null
  createdAt: Date
  updatedAt: Date

  // Relations
  sender: User
  receiver: User
  parentMessage?: Message | null
  replies?: Message[]
}

export interface AuditLog {
  id: number
  userId?: number | null
  action: string
  entityType: string
  entityId?: number | null
  oldValues?: Record<string, unknown> | null
  newValues?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date

  // Relations
  user?: User | null
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

// Search and Filter Types
export interface JobSearchParams {
  query?: string
  location?: string
  jobType?: JobType
  isRemote?: boolean
  salaryMin?: number
  salaryMax?: number
  experienceLevel?: ExperienceLevel
  skills?: string[]
  companyId?: number
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'salaryMin' | 'salaryMax' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

export interface JobFilters {
  jobTypes: JobType[]
  experienceLevels: ExperienceLevel[]
  salaryRanges: { min: number; max: number; label: string }[]
  skills: Skill[]
  companies: Company[]
  locations: string[]
}

// Form Types
export interface CreateJobForm {
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salaryMin?: number
  salaryMax?: number
  currency: string
  location?: string
  isRemote: boolean
  jobType: JobType
  experienceLevel: ExperienceLevel
  applicationDeadline?: Date
  companyId: number
  skillIds: number[]
}

export interface UpdateJobForm extends Partial<CreateJobForm> {
  id: number
}

export interface ProfileForm {
  summary?: string
  skills: string[]
  experienceLevel: ExperienceLevel
  portfolio?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  location?: string
  preferredSalary?: number
  isOpenToWork: boolean
}

export interface CompanyForm {
  name: string
  description?: string
  industry?: string
  size?: string
  website?: string
  location?: string
  foundedYear?: number
}

export interface ApplicationForm {
  jobId: number
  coverLetter?: string
  resumeUrl?: string
}

export interface ExperienceForm {
  jobTitle: string
  company: string
  location?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  description?: string
}

export interface EducationForm {
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  grade?: string
  description?: string
  educationLevel: EducationLevel
}

export interface UserSkillForm {
  skillId: number
  level: SkillLevel
  yearsOfExperience?: number
}

export interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  token: string
  newPassword: string
  confirmPassword: string
}

// Authentication Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  role: Role
}

export interface AuthUser {
  id: number
  email: string
  fullName?: string
  role: Role
  avatar?: string
  isEmailVerified: boolean
  isActive: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

// Dashboard Types
export interface DashboardStats {
  totalJobs: number
  totalApplications: number
  totalUsers: number
  totalCompanies: number
  activeJobs: number
  pendingApplications: number
  recentApplications: number
  jobViews: number
}

export interface UserDashboardStats {
  appliedJobs: number
  savedJobs: number
  profileViews: number
  unreadMessages: number
  recentApplications: Application[]
  recommendedJobs: Job[]
}

export interface CompanyDashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  totalViews: number
  recentApplications: Application[]
  topJobs: Job[]
}

// Chart and Analytics Types
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

export interface ApplicationStats {
  total: number
  pending: number
  reviewed: number
  accepted: number
  rejected: number
}

export interface JobStats {
  total: number
  open: number
  closed: number
  draft: number
  views: number
  applications: number
}

// Utility Types
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, item: T) => ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
}

// Error Types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: ValidationError[]
}

// File Upload Types
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// Notification Types
export interface NotificationSettings {
  emailNotifications: boolean
  jobAlerts: boolean
  applicationUpdates: boolean
  messages: boolean
  promotions: boolean
}

// Privacy and Settings Types
export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS'
  showEmail: boolean
  showPhone: boolean
  showResume: boolean
  allowJobRecommendations: boolean
}

export interface UserSettings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  language: string
  timezone: string
  currency: string
}

// Export all enums as types for backward compatibility
export type UserRole = Role
export type JobTypeType = JobType
export type JobStatusType = JobStatus
export type ApplicationStatusType = ApplicationStatus
export type ExperienceLevelType = ExperienceLevel
export type EducationLevelType = EducationLevel
export type SkillLevelType = SkillLevel
