export interface CV {
  id: number
  title: string
  cvFile: string
  status: 'ACTIVE' | 'INACTIVE'
  skills: string
  experience: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface CVRequest {
  title: string
  cvFile: File
  skills?: string
  experience?: string
  content?: string
  // userId will be automatically added from auth store
}

export interface CVResponse {
  id: number
  title: string
  cvFile: string
  status: string
  skills: string
  experience: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface CVListResponse {
  data: CVResponse[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean
}
