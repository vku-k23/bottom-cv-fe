import { apiClient } from './api'

export interface Role {
  id: number
  name: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
}

export interface Profile {
  id: number
  firstName: string
  lastName: string
  dayOfBirth?: string
  address?: string
  phoneNumber?: string
  email: string
  avatar?: string
  description?: string
}

export interface User {
  id: number
  userCode: string
  username: string
  roles: Role[]
  profile?: Profile
  status: 'ACTIVE' | 'PENDING' | 'BANNED'
  createdAt: string
  updatedAt: string
}

export interface UserFilterParams {
  search?: string
  role?: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE'
  status?: 'ACTIVE' | 'PENDING' | 'BANNED'
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}

export interface UpdateUserRolesRequest {
  roles: Array<'ADMIN' | 'EMPLOYER' | 'CANDIDATE'>
}

export interface UpdateUserStatusRequest {
  status: 'ACTIVE' | 'PENDING' | 'BANNED'
  reason?: string
}

export interface CreateUserRequest {
  username: string
  password: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  dayOfBirth: string // dd-MM-yyyy
  address: string
  roles: Array<'ADMIN' | 'EMPLOYER' | 'CANDIDATE'>
  description?: string
  avatar?: string
}

export const userManagementService = {
  // Create user
  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>('/back/users', data)
  },

  // Get users with filters
  async getUsers(params: UserFilterParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.role) queryParams.append('role', params.role)
    if (params.status) queryParams.append('status', params.status)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortDirection)
      queryParams.append('sortDirection', params.sortDirection)
    if (params.page !== undefined)
      queryParams.append('page', params.page.toString())
    if (params.size !== undefined)
      queryParams.append('size', params.size.toString())

    return apiClient.get<PaginatedResponse<User>>(
      `/back/users?${queryParams.toString()}`
    )
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    return apiClient.get<User>(`/back/users/${id}`)
  },

  // Update user roles
  async updateUserRoles(
    id: number,
    roles: UpdateUserRolesRequest
  ): Promise<User> {
    return apiClient.put<User>(`/back/users/${id}/roles`, roles)
  },

  // Activate user
  async activateUser(id: number): Promise<User> {
    return apiClient.put<User>(`/back/users/${id}/activate`, {})
  },

  // Update user status (ban/deactivate)
  async updateUserStatus(
    id: number,
    request: UpdateUserStatusRequest
  ): Promise<User> {
    return apiClient.put<User>(`/back/users/${id}/status`, request)
  },

  // Admin reset password
  async resetPassword(id: number): Promise<void> {
    return apiClient.post<void>(`/back/users/${id}/reset-password`, {})
  },

  // Impersonate user
  async impersonateUser(id: number): Promise<void> {
    return apiClient.post<void>(`/back/users/${id}/impersonate`, {})
  },
}
