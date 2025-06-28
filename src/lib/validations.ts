import { z } from 'zod'

// User validation schemas
export const userRoleSchema = z.enum(['JOB_SEEKER', 'EMPLOYER', 'ADMIN'])
export const userStatusSchema = z.enum([
  'ACTIVE',
  'SUSPENDED',
  'PENDING_VERIFICATION',
])

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: userRoleSchema,
  status: userStatusSchema,
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Job validation schemas
export const jobTypeSchema = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'FREELANCE',
  'INTERNSHIP',
])
export const workLocationSchema = z.enum(['REMOTE', 'ONSITE', 'HYBRID'])
export const jobStatusSchema = z.enum([
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
  'EXPIRED',
])

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().default('USD'),
  type: jobTypeSchema,
  workLocation: workLocationSchema,
  location: z.string().optional(),
  remote: z.boolean().default(false),
  experienceLevel: z.string().optional(),
  expiresAt: z.date().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export const updateJobSchema = createJobSchema.partial()

// Profile validation schemas
export const jobSeekerProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  resume: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  isOpenToWork: z.boolean().default(true),
})

export const workExperienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
})

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean().default(false),
  gpa: z.number().min(0).max(4).optional(),
  description: z.string().optional(),
})

// Company validation schemas
export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional(),
  website: z.string().url().optional(),
  size: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
})

// Application validation schemas
export const applicationStatusSchema = z.enum([
  'APPLIED',
  'SCREENING',
  'INTERVIEWING',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
  'HIRED',
])

export const applyJobSchema = z.object({
  coverLetter: z.string().optional(),
  resume: z.string().url().optional(),
})

// Search validation schemas
export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  type: jobTypeSchema.optional(),
  workLocation: workLocationSchema.optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  experienceLevel: z.string().optional(),
  skills: z.array(z.string()).optional(),
  companySize: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(50).default(10),
  sortBy: z.enum(['createdAt', 'salary', 'relevance']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  role: userRoleSchema,
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Export types
export type User = z.infer<typeof userSchema>
export type CreateJob = z.infer<typeof createJobSchema>
export type UpdateJob = z.infer<typeof updateJobSchema>
export type JobSeekerProfile = z.infer<typeof jobSeekerProfileSchema>
export type WorkExperience = z.infer<typeof workExperienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Company = z.infer<typeof companySchema>
export type ApplyJob = z.infer<typeof applyJobSchema>
export type JobSearch = z.infer<typeof jobSearchSchema>
export type SignUp = z.infer<typeof signUpSchema>
export type SignIn = z.infer<typeof signInSchema>
