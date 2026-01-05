import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/lib/subscriptionService'
import { useAuth } from './useAuth'

export function useSubscription() {
  const { user } = useAuth()

  // Get employer's company ID from user object
  const companyId = (user as { company?: { id: number } })?.company?.id

  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscription', companyId],
    queryFn: async () => {
      const result = await subscriptionService.getCompanySubscription(companyId!)
      // Ensure we never return undefined (React Query requirement)
      return result ?? null
    },
    enabled: !!companyId,
    retry: false,
  })

  const {
    data: hasActiveSubscription,
    isLoading: isVerifying,
  } = useQuery({
    queryKey: ['subscription-verify', companyId],
    queryFn: () => subscriptionService.verifySubscription(companyId!),
    enabled: !!companyId,
    retry: false,
  })

  return {
    subscription,
    hasActiveSubscription: hasActiveSubscription ?? false,
    isLoading: isLoading || isVerifying,
    error,
    companyId,
  }
}

