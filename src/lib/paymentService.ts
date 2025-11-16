import { apiClient } from './api'

export interface Payment {
  id: number
  userId: number
  amount: number
  currency: string
  status: string
  paymentMethod?: string
  transactionId?: string
  createdAt?: string
  updatedAt?: string
}

export interface PaymentListResponse {
  data: Payment[] // Backend returns 'data' not 'content'
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLast: boolean // Backend returns 'isLast' not 'last'
}

export const paymentService = {
  // Admin APIs
  async getAllPayments(params?: {
    pageNo?: number
    pageSize?: number
  }): Promise<PaymentListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.pageNo !== undefined)
      queryParams.append('pageNo', params.pageNo.toString())
    if (params?.pageSize !== undefined)
      queryParams.append('pageSize', params.pageSize.toString())

    return apiClient.get<PaymentListResponse>(
      `/back/billing/invoices?${queryParams.toString()}`
    )
  },

  async getPaymentById(id: number): Promise<Payment> {
    // Backend doesn't have getById endpoint, so we'll fetch from list and find
    const response = await apiClient.get<PaymentListResponse>(
      `/back/billing/invoices?pageNo=0&pageSize=1000`
    )
    const payment = response.data.find((p) => p.id === id)
    if (!payment) throw new Error('Payment not found')
    return payment
  },
}
