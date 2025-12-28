import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/lib/auth'
import {
  AuthState,
  User,
  LoginRequest,
  RegisterRequest,
  LoginFormData,
  SignupFormData,
} from '@/types/auth'
import { useEffect, useRef } from 'react'

interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>
  register: (userData: SignupFormData) => Promise<void>
  logout: () => void
  refreshAuthToken: () => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => void
  fetchCurrentUser: (force?: boolean) => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginFormData) => {
        set({ isLoading: true, error: null })

        try {
          // Map email to username for backend compatibility
          const loginRequest: LoginRequest = {
            username: credentials.username, // Backend expects username
            password: credentials.password,
          }

          const response = await authService.login(loginRequest)

          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          // Setup automatic token refresh
          authService.setupTokenRefresh()

          // Fetch current user profile after successful login
          try {
            const user = await authService.getCurrentUser()
            set({ user })
          } catch (e) {
            console.error('Failed to load user after login', e)
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Login failed'
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            refreshToken: null,
          })
          throw error
        }
      },

      register: async (userData: SignupFormData) => {
        set({ isLoading: true, error: null })

        try {
          const formattedDate = new Date(userData.dayOfBirth)
          const today = new Date()
          if (formattedDate >= today) {
            throw new Error('Date of birth must be in the past')
          }

          // Convert from input yyyy-MM-dd to dd-MM-yyyy
          const dayOfBirth = `${formattedDate.getDate().toString().padStart(2, '0')}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getFullYear()}`

          const registerRequest: RegisterRequest = {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dayOfBirth,
          }

          const user = await authService.register(registerRequest)

          set({
            user,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Registration failed'
          set({
            isLoading: false,
            error: errorMessage,
          })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
        if (typeof window !== 'undefined') {
          window.location.href = '/home'
        }
      },

      refreshAuthToken: async () => {
        try {
          const response = await authService.refreshToken()
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          })
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      setUser: (user: User | null) => {
        set({ user })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: () => {
        const isAuthenticated = authService.isAuthenticated()
        const token = authService.getAccessToken()

        if (isAuthenticated && token) {
          set({
            isAuthenticated: true,
            token,
            refreshToken:
              typeof window !== 'undefined'
                ? localStorage.getItem('refresh_token')
                : null,
          })

          // Setup automatic token refresh
          authService.setupTokenRefresh()
        } else {
          // If not authenticated, make sure to set the state
          set({
            isAuthenticated: false,
            token: null,
            refreshToken: null,
          })
        }
      },
      fetchCurrentUser: async (force?: boolean) => {
        try {
          const { isAuthenticated, user } = get()
          // Fetch if:
          // - not authenticated => skip
          // - authenticated and no user => fetch
          // - authenticated and user exists but missing profile or essential profile fields => fetch
          if (!isAuthenticated) return
          const hasCompleteProfile = !!(
            user?.profile &&
            user.profile.firstName &&
            user.profile.lastName
          )
          if (!force && user && hasCompleteProfile) return
          const currentUser = await authService.getCurrentUser()
          set({ user: currentUser })
        } catch (e: unknown) {
          console.error('Fetch current user failed', e)
          if (
            e instanceof Error &&
            (/Authentication failed/i.test(e.message) || /403/.test(e.message))
          ) {
            get().logout()
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hook to initialize auth on app start
export const useInitializeAuth = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    if (typeof window !== 'undefined') {
      initializeAuth()
      fetchCurrentUser()
      initializedRef.current = true
    }
  }, [initializeAuth, fetchCurrentUser])
}
