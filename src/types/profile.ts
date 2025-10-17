export interface ProfileResponse {
  id: number
  firstName: string
  lastName: string
  dayOfBirth: string // Format: "dd-MM-yyyy"
  address?: string
  phoneNumber: string
  email: string
  avatar?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ProfileRequest {
  firstName: string
  lastName: string
  dayOfBirth: string // Format: "dd-MM-yyyy"
  address?: string
  email: string
  phoneNumber: string
  avatar?: string
  description?: string
}
