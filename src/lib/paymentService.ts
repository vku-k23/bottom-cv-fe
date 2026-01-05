import { apiClient } from './api'

export interface PaymentSessionRequest {
  provider: string
  amountMinor: number
  currency: string
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM'
  companyId: number
}

export interface PaymentSessionResponse {
  id?: number
  provider: string
  status: string
  referenceId?: string
  currency: string
  amountMinor?: number
  checkoutSessionUrl?: string
  sessionId?: string
}

export const paymentService = {
  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(
    planType: 'BASIC' | 'STANDARD' | 'PREMIUM',
    companyId: number
  ): Promise<PaymentSessionResponse> {
    // Map plan type to price (in cents for USD)
    const priceMap: Record<string, number> = {
      BASIC: 1900, // $19.00
      STANDARD: 3900, // $39.00
      PREMIUM: 5900, // $59.00
    }

    const request: PaymentSessionRequest = {
      provider: 'STRIPE',
      amountMinor: priceMap[planType] || 0,
      currency: 'USD',
      planType,
      companyId,
    }

    const response = await apiClient.post<PaymentSessionResponse>(
      '/back/payments/create-session',
      request
    )
    return response.data
  },
}
