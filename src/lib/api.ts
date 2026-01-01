import { env } from './env'

// API base URL configuration
export const API_BASE_URL =
  env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    confirmForgotPassword: '/auth/confirm-forgot-password',
    verifyEmail: '/auth/verify-email',
    me: '/auth/me', // New get me endpoint
  },
  jobs: {
    list: '/front/jobs',
    get: (id: number) => `/front/jobs/${id}`,
    recommended: '/front/jobs/recommended/result',
    requestRecommendation: '/front/jobs/recommended/request',
  },
  companies: {
    list: '/front/companies',
    get: (id: number) => `/front/companies/${id}`,
  },
  cv: {
    list: '/cvs',
    get: (id: number) => `/cvs/${id}`,
    create: '/cvs',
    update: (id: number) => `/cvs/${id}`,
    delete: (id: number) => `/cvs/${id}`,
  },
  user: {
    profile: '/users/profile',
  },
  upload: {
    cv: '/upload/cv',
    profileImage: '/upload/profile-image',
    companyLogo: '/upload/company-logo',
  },
} as const

// --- Interfaces ---

export interface ListResponse<T> {
  data: T[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export interface CompanyResponse {
  id: number
  name: string
  slug: string
  introduce?: string
  socialMediaLinks?: Record<string, string>
  addresses?: Record<string, string>
  phone?: string
  email?: string
  website?: string
  logo?: string
  cover?: string
  industry?: string
  companySize?: string
  foundedYear?: number
  verified?: boolean
  jobs?: JobResponse[]
}

export interface CategoryResponse {
  id: number
  name: string
  slug: string
}

export interface JobResponse {
  id: number
  title: string
  jobDescription: string
  jobRequirement?: string
  jobBenefit?: string
  jobType: string // 'FULL_TIME', 'PART_TIME', etc.
  location: string
  salary?: number
  careerLevel?: string
  qualification?: string
  experience?: string
  expiryDate?: string
  status: string
  company?: CompanyResponse
  categories?: CategoryResponse[]
  createdAt: string
}

export interface JobSearchRequest {
  keyword?: string
  location?: string
  jobType?: string
  minSalary?: number
  maxSalary?: number
  categoryId?: number
  status?: string
  sortBy?: string
  sortDirection?: string
  page?: number
  size?: number
}

// HTTP client configuration
export class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    // Try to get token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token)
      } else {
        localStorage.removeItem('access_token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    try {
      console.log('Making API request to:', url)
      const response = await fetch(url, config)
      console.log('API response status:', response.status)

      // Handle different response types
      if (!response.ok) {
        // Try to extract error message from response first
        let errorMessage = `HTTP Error: ${response.status}`
        let errorData: unknown = null
        try {
          errorData = await response.json()
          if (typeof errorData === 'object' && errorData !== null) {
            const ed = errorData as Record<string, unknown>
            const candidates = [
              ed.errorMessage,
              ed.message,
              ed.error,
              ed.detail,
              ed.description,
            ]
            const found = candidates.find(
              (v): v is string => typeof v === 'string' && v.trim().length > 0
            )
            if (found) errorMessage = found
          }
        } catch {
          // ignore json parse error
        }

        // Check if this is an authentication-related error (401, or 404 with user not found)
        // Note: 403 is NOT an auth error - user is authenticated but lacks permission
        const isAuthError =
          response.status === 401 ||
          (response.status === 404 &&
            typeof errorData === 'object' &&
            errorData !== null &&
            (errorData as Record<string, unknown>).errorMessage &&
            typeof (errorData as Record<string, unknown>).errorMessage ===
              'string' &&
            ((errorData as Record<string, unknown>).errorMessage as string)
              .toLowerCase()
              .includes('username'))

        if (isAuthError) {
          // Authentication failed - clear token and use backend error message
          this.setToken(null)
          // If we got a specific error message from backend, use it; otherwise use generic
          if (errorMessage === `HTTP Error: ${response.status}`) {
            errorMessage =
              'Authentication failed. Please check your username and password.'
          }
          throw new Error(errorMessage)
        }

        // Handle 403 (Forbidden) - user is authenticated but lacks permission
        // Don't clear token, just throw error with special flag
        if (response.status === 403) {
          if (errorMessage === `HTTP Error: ${response.status}`) {
            errorMessage = 'Access forbidden'
          }
          const forbiddenError = new Error(errorMessage) as Error & {
            isForbidden?: boolean
          }
          forbiddenError.isForbidden = true
          throw forbiddenError
        }

        const error = new Error(errorMessage)
        throw error
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        return response.text() as unknown as T
      }
    } catch (error) {
      console.error('API request failed:', error)
      if (error instanceof Error) {
        // Check if it's a network error
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ) {
          throw new Error(
            'Unable to connect to server. Please check your internet connection and try again.'
          )
        }
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // File upload method
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {},
    }

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          throw new Error('Authentication failed')
        }

        if (response.status === 403) {
          // Don't clear token - user is authenticated but lacks permission
          const forbiddenError = new Error('Access forbidden') as Error & {
            isForbidden?: boolean
          }
          forbiddenError.isForbidden = true
          throw forbiddenError
        }

        let errorMessage = `HTTP Error: ${response.status}`
        try {
          const errorData: unknown = await response.json()
          if (typeof errorData === 'object' && errorData !== null) {
            const ed = errorData as Record<string, unknown>
            const candidates = [
              ed.errorMessage,
              ed.message,
              ed.error,
              ed.detail,
              ed.description,
            ]
            const found = candidates.find(
              (v): v is string => typeof v === 'string' && v.trim().length > 0
            )
            if (found) errorMessage = found
          }
        } catch {
          // ignore json parse error
        }

        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        return response.text() as unknown as T
      }
    } catch (error) {
      console.error('API request failed:', error)
      if (error instanceof Error) {
        // Check if it's a network error
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ) {
          throw new Error(
            'Unable to connect to server. Please check your internet connection and try again.'
          )
        }
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // File upload method for PUT requests
  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      method: 'PUT',
      body: formData,
      headers: {},
    }

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null)
          throw new Error('Authentication failed')
        }

        if (response.status === 403) {
          // Don't clear token - user is authenticated but lacks permission
          const forbiddenError = new Error('Access forbidden') as Error & {
            isForbidden?: boolean
          }
          forbiddenError.isForbidden = true
          throw forbiddenError
        }

        let errorMessage = `HTTP Error: ${response.status}`
        try {
          const errorData: unknown = await response.json()
          if (typeof errorData === 'object' && errorData !== null) {
            const ed = errorData as Record<string, unknown>
            const candidates = [
              ed.errorMessage,
              ed.message,
              ed.error,
              ed.detail,
              ed.description,
            ]
            const found = candidates.find(
              (v): v is string => typeof v === 'string' && v.trim().length > 0
            )
            if (found) errorMessage = found
          }
        } catch {
          // ignore json parse error
        }

        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        return response.text() as unknown as T
      }
    } catch (error) {
      console.error('API request failed:', error)
      if (error instanceof Error) {
        // Check if it's a network error
        if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ) {
          throw new Error(
            'Unable to connect to server. Please check your internet connection and try again.'
          )
        }
        throw error
      }
      throw new Error('Network error occurred')
    }
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()
