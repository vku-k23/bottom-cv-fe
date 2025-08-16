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
  },
  user: {
    profile: '/front/profile', // adjusted to match prior usage (/api/front/profile) with new base /api/v1
  },
} as const

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
      const response = await fetch(url, config)

      // Handle different response types
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null)
          throw new Error('Authentication failed')
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
      if (error instanceof Error) {
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
}

// Create a singleton instance
export const apiClient = new ApiClient()
