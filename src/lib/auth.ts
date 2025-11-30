import { apiClient, API_ENDPOINTS } from '@/lib/api'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth'

export class AuthService {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        credentials
      )

      if (response.accessToken) {
        apiClient.setToken(response.accessToken)
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', response.accessToken)
          localStorage.setItem('refresh_token', response.refreshToken)
          localStorage.setItem(
            'token_expires_in',
            response.expiresIn.toString()
          )
        }
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        API_ENDPOINTS.auth.signup,
        userData
      )
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refresh_token')
          : null

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.auth.refreshToken,
        { refreshToken } as RefreshTokenRequest
      )

      apiClient.setToken(response.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.refreshToken)
      }

      return response
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout()
      throw error
    }
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    apiClient.setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('token_expires_in')
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>(API_ENDPOINTS.auth.me)
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    const token = localStorage.getItem('access_token')
    const expiresIn = localStorage.getItem('token_expires_in')

    if (!token || !expiresIn) return false

    return true
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  setupTokenRefresh(): void {
    if (typeof window === 'undefined') return

    const expiresIn = localStorage.getItem('token_expires_in')
    if (!expiresIn) return

    // expiresIn is already in milliseconds from backend
    // Refresh 5 minutes (300000ms) before expiration
    const refreshTime = Math.max(parseInt(expiresIn) - 300000, 60000) // minimum 1 minute

    setTimeout(async () => {
      try {
        await this.refreshToken()
        this.setupTokenRefresh()
      } catch (error) {
        console.error('Auto token refresh failed:', error)
      }
    }, refreshTime)
  }
}

export const authService = new AuthService()
