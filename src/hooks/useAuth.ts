import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'react-hot-toast'
import { SignupFormData, User, LoginFormData } from '@/types/auth'

// Hook for authentication logic
interface UseAuthResult {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (data: SignupFormData) => Promise<void>
  logout: () => void
}

export const useAuth = (): UseAuthResult => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: rawLogin,
    register,
    logout,
    clearError,
    initializeAuth,
  } = useAuthStore()

  const router = useRouter()

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleLogin = async (credentials: {
    username: string
    password: string
  }) => {
    try {
      const loginForm: LoginFormData = {
        username: credentials.username,
        password: credentials.password,
      }
      await (rawLogin as (data: LoginFormData) => Promise<void>)(loginForm)
      toast.success('Login successful!')
      router.push('/') // Redirect to dashboard after login
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleRegister = async (userData: SignupFormData) => {
    try {
      await register(userData)
      toast.success('Registration successful! Please login.')
      router.push('/auth/signin') // Redirect to login after registration
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/') // Redirect to home after logout
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}

// Hook to protect routes (redirect to login if not authenticated)
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

// Hook to redirect authenticated users (for login/register pages)
export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
