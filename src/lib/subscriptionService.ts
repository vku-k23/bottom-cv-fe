import { apiClient } from './api'

export interface Subscription {
  id: number
  companyId: number
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM'
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'FAILED'
  startDate: string
  expiryDate: string
}

export interface SubscriptionVerification {
  hasActiveSubscription: boolean
}

export const subscriptionService = {
  /**
   * Get active subscription for a company
   */
  async getCompanySubscription(companyId: number): Promise<Subscription | null> {
    try {
      const response = await apiClient.get<Subscription>(
        `/back/subscriptions/company/${companyId}`
      )
      // apiClient.get returns the data directly, not wrapped in .data
      return response as Subscription
    } catch (error) {
      // If subscription doesn't exist (404), return null
      console.error('Error fetching subscription:', error)
      return null
    }
  },

  /**
   * Verify if company has an active subscription
   */
  async verifySubscription(companyId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<SubscriptionVerification>(
        `/back/subscriptions/verify/${companyId}`
      )
      // apiClient.get returns the data directly, not wrapped in .data
      return (response as SubscriptionVerification).hasActiveSubscription
    } catch (error) {
      // If subscription doesn't exist, return false
      return false
    }
  },
}

