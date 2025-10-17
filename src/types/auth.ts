// Authentication related types matching Spring Boot backend

export interface LoginRequest {
  username: string // Backend expects username, not email
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  dayOfBirth: string // Format: "dd-MM-yyyy"
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: number
  username: string
  userCode: string
  roles: Role[]
  profile?: Profile
  status: string
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
}

export interface Profile {
  id: number
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  address?: string
  dayOfBirth: string
  avatar?: string
  userId: number
}

// Form validation types
export interface LoginFormData {
  username: string // We'll map this to username in the request
  password: string
}

export interface SignupFormData {
  username: string
  password: string
  confirmPassword: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  dayOfBirth: string // Format: "dd-MM-yyyy" for backend submission, captured as YYYY-MM-DD from input then transformed
}

// Auth store state
export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// API Error response
export interface ApiError {
  message: string
  status: number
  timestamp: string
  path: string
}
