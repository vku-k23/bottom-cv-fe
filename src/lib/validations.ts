import { z } from 'zod'

// Enum validation schemas
export const roleSchema = z.enum(['ADMIN', 'HR', 'USER'])
export const jobTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'])
export const jobStatusSchema = z.enum(['OPEN', 'CLOSED', 'DRAFT'])
export const applicationStatusSchema = z.enum(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'])
export const experienceLevelSchema = z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD'])
export const educationLevelSchema = z.enum(['HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD'])
export const skillLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])

// User validation schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  passwordHash: z.string(),
  fullName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  dateOfBirth: z.date().optional().nullable(),
  role: roleSchema,
  avatar: z.string().optional().nullable(),
  isEmailVerified: z.boolean().default(false),
  emailVerificationToken: z.string().optional().nullable(),
  passwordResetToken: z.string().optional().nullable(),
  passwordResetExpires: z.date().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  refreshTokenExpiry: z.date().optional().nullable(),
  lastLogin: z.date().optional().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Profile validation schemas
export const profileSchema = z.object({
  id: z.number(),
  userId: z.number(),
  summary: z.string().optional().nullable(),
  skills: z.array(z.string()),
  experienceLevel: experienceLevelSchema,
  portfolio: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  preferredSalary: z.number().positive().optional().nullable(),
  isOpenToWork: z.boolean().default(true),
  resumeUrl: z.string().url().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const profileFormSchema = z.object({
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experienceLevel: experienceLevelSchema,
  portfolio: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  preferredSalary: z.number().positive().optional(),
  isOpenToWork: z.boolean().default(true),
})

// Company validation schemas
export const companySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional().nullable(),
  createdById: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
})

// Job validation schemas
export const jobSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string(),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  benefits: z.array(z.string()),
  salaryMin: z.number().positive().optional().nullable(),
  salaryMax: z.number().positive().optional().nullable(),
  currency: z.string().default('USD'),
  location: z.string().optional().nullable(),
  isRemote: z.boolean().default(false),
  jobType: jobTypeSchema,
  experienceLevel: experienceLevelSchema,
  status: jobStatusSchema,
  applicationDeadline: z.date().optional().nullable(),
  postedById: z.number(),
  companyId: z.number(),
  viewCount: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string().min(1)).min(1, 'At least one requirement is needed'),
  responsibilities: z.array(z.string().min(1)).min(1, 'At least one responsibility is needed'),
  benefits: z.array(z.string().min(1)).optional().default([]),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().default('USD'),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  jobType: jobTypeSchema,
  experienceLevel: experienceLevelSchema,
  applicationDeadline: z.date().optional(),
  companyId: z.number(),
  skillIds: z.array(z.number()).optional().default([]),
})

export const updateJobSchema = createJobSchema.partial().extend({
  id: z.number(),
})

// Experience validation schemas
export const experienceSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional().nullable(),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const experienceFormSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
})

// Education validation schemas
export const educationSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  grade: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  educationLevel: educationLevelSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const educationFormSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  isCurrent: z.boolean().default(false),
  grade: z.string().optional(),
  description: z.string().optional(),
  educationLevel: educationLevelSchema,
})

// Skill validation schemas
export const skillSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userSkillSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  skillId: z.number(),
  level: skillLevelSchema,
  yearsOfExperience: z.number().min(0).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userSkillFormSchema = z.object({
  skillId: z.number(),
  level: skillLevelSchema,
  yearsOfExperience: z.number().min(0).optional(),
})

export const jobSkillSchema = z.object({
  id: z.number(),
  jobId: z.number(),
  skillId: z.number(),
  isRequired: z.boolean().default(false),
  experienceYears: z.number().min(0).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Application validation schemas
export const applicationSchema = z.object({
  id: z.number(),
  jobId: z.number(),
  applicantId: z.number(),
  coverLetter: z.string().optional().nullable(),
  resumeUrl: z.string().url().optional().nullable(),
  status: applicationStatusSchema,
  appliedAt: z.date(),
  reviewedAt: z.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const applicationFormSchema = z.object({
  jobId: z.number(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
})

// Search validation schemas
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  jobType: jobTypeSchema.optional(),
  isRemote: z.boolean().optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  experienceLevel: experienceLevelSchema.optional(),
  skills: z.array(z.string()).optional(),
  companyId: z.number().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(50).default(10),
  sortBy: z.enum(['createdAt', 'salaryMin', 'salaryMax', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(1, 'Full name is required'),
  role: roleSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Message validation schemas
export const messageSchema = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  isRead: z.boolean().default(false),
  parentMessageId: z.number().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const sendMessageSchema = z.object({
  receiverId: z.number(),
  subject: z.string().min(1, 'Subject is required').max(200),
  content: z.string().min(1, 'Content is required'),
  parentMessageId: z.number().optional(),
})

// Notification validation schemas
export const notificationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.string(),
  isRead: z.boolean().default(false),
  data: z.record(z.unknown()).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Export inferred types
export type Role = z.infer<typeof roleSchema>
export type JobType = z.infer<typeof jobTypeSchema>
export type JobStatus = z.infer<typeof jobStatusSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type ExperienceLevel = z.infer<typeof experienceLevelSchema>
export type EducationLevel = z.infer<typeof educationLevelSchema>
export type SkillLevel = z.infer<typeof skillLevelSchema>

export type User = z.infer<typeof userSchema>
export type Profile = z.infer<typeof profileSchema>
export type ProfileForm = z.infer<typeof profileFormSchema>
export type Company = z.infer<typeof companySchema>
export type CompanyForm = z.infer<typeof companyFormSchema>
export type Job = z.infer<typeof jobSchema>
export type CreateJob = z.infer<typeof createJobSchema>
export type UpdateJob = z.infer<typeof updateJobSchema>
export type Experience = z.infer<typeof experienceSchema>
export type ExperienceForm = z.infer<typeof experienceFormSchema>
export type Education = z.infer<typeof educationSchema>
export type EducationForm = z.infer<typeof educationFormSchema>
export type Skill = z.infer<typeof skillSchema>
export type UserSkill = z.infer<typeof userSkillSchema>
export type UserSkillForm = z.infer<typeof userSkillFormSchema>
export type JobSkill = z.infer<typeof jobSkillSchema>
export type Application = z.infer<typeof applicationSchema>
export type ApplicationForm = z.infer<typeof applicationFormSchema>
export type JobSearch = z.infer<typeof jobSearchSchema>
export type Register = z.infer<typeof registerSchema>
export type Login = z.infer<typeof loginSchema>
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>
export type ResetPassword = z.infer<typeof resetPasswordSchema>
export type ChangePassword = z.infer<typeof changePasswordSchema>
export type Message = z.infer<typeof messageSchema>
export type SendMessage = z.infer<typeof sendMessageSchema>
export type Notification = z.infer<typeof notificationSchema>
