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

      // Store tokens
      if (response.accessToken) {
        apiClient.setToken(response.accessToken)
        if (typeof window !== 'undefined') {
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

      // Update stored tokens
      apiClient.setToken(response.accessToken)
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.refreshToken)
      }

      return response
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout() // Clear invalid tokens
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

  /**
   * Get current user profile (if needed)
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Adjusted path to match new API_BASE_URL that already includes /api/v1
      // Ensure backend exposes this endpoint accordingly
      return await apiClient.get<User>(API_ENDPOINTS.user.profile)
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    const token = localStorage.getItem('access_token')
    const expiresIn = localStorage.getItem('token_expires_in')

    if (!token || !expiresIn) return false

    // You might want to add token expiration check here
    return true
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  /**
   * Set up automatic token refresh
   */
  setupTokenRefresh(): void {
    if (typeof window === 'undefined') return

    const expiresIn = localStorage.getItem('token_expires_in')
    if (!expiresIn) return

    // Refresh token 5 minutes before expiration
    const refreshTime = (parseInt(expiresIn) - 300) * 1000

    setTimeout(async () => {
      try {
        await this.refreshToken()
        this.setupTokenRefresh() // Setup next refresh
      } catch (error) {
        console.error('Auto token refresh failed:', error)
      }
    }, refreshTime)
  }
}

// Create singleton instance
export const authService = new AuthService()
