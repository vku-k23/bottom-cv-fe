import { PricingPlanData } from '@/types/pricing'

export const pricingPlans: PricingPlanData[] = [
  {
    id: 'basic',
    name: 'BASIC',
    title: 'BASIC',
    description:
      'Praesent eget pulvinar orci. Duis ut pellentesque ligula convalis.',
    price: 19,
    period: 'MONTHLY',
    recommended: false,
    buttonVariant: 'outline',
    features: [
      { id: 'basic-1', text: 'Post 1 Job', included: true },
      { id: 'basic-2', text: 'Urgents & Featured Jobs', included: true },
      { id: 'basic-3', text: 'Highlights Job with Colors', included: true },
      { id: 'basic-4', text: 'Access & Saved 5 Candidates', included: true },
      { id: 'basic-5', text: '10 Days Resume Visibility', included: true },
      { id: 'basic-6', text: '24/7 Critical Support', included: true },
    ],
  },
  {
    id: 'standard',
    name: 'STANDARD',
    title: 'STANDARD',
    description:
      'Praesent eget pulvinar orci. Duis ut pellentesque ligula convalis.',
    price: 39,
    period: 'MONTHLY',
    recommended: true,
    buttonVariant: 'default',
    features: [
      { id: 'standard-1', text: '3 Active Jobs', included: true },
      { id: 'standard-2', text: 'Urgents & Featured Jobs', included: true },
      { id: 'standard-3', text: 'Highlights Job with Colors', included: true },
      {
        id: 'standard-4',
        text: 'Access & Saved 10 Candidates',
        included: true,
      },
      { id: 'standard-5', text: '20 Days Resume Visibility', included: true },
      { id: 'standard-6', text: '24/7 Critical Support', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    title: 'PREMIUM',
    description:
      'Praesent eget pulvinar orci. Duis ut pellentesque ligula convalis.',
    price: 59,
    period: 'MONTHLY',
    recommended: false,
    buttonVariant: 'outline',
    features: [
      { id: 'premium-1', text: '6 Active Jobs', included: true },
      { id: 'premium-2', text: 'Urgents & Featured Jobs', included: true },
      { id: 'premium-3', text: 'Highlights Job with Colors', included: true },
      { id: 'premium-4', text: 'Access & Saved 20 Candidates', included: true },
      { id: 'premium-5', text: '30 Days Resume Visibility', included: true },
      { id: 'premium-6', text: '24/7 Critical Support', included: true },
    ],
  },
]
