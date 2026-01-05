export type PricingPlan = 'BASIC' | 'STANDARD' | 'PREMIUM'
export type PricingPeriod = 'MONTHLY' | 'YEARLY'

export interface PricingFeature {
  id: string
  text: string
  included: boolean
}

export interface PricingPlanData {
  id: string
  name: PricingPlan
  title: string
  description: string
  price: number
  period: PricingPeriod
  features: PricingFeature[]
  recommended: boolean
  buttonVariant: 'outline' | 'default'
}

// Price formatting
export const formatPrice = (amount: number): string => `$${amount}`

// Period formatting
export const formatPeriod = (period: PricingPeriod): string => {
  return period === 'MONTHLY' ? '/Monthly' : '/Yearly'
}
