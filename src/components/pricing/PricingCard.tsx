import { PricingPlanData, formatPrice, formatPeriod } from '@/types/pricing'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CircleCheck, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  plan: PricingPlanData
  onSelectPlan?: (planId: string) => void
}

export function PricingCard({ plan, onSelectPlan }: PricingCardProps) {
  const handleSelectPlan = () => {
    onSelectPlan?.(plan.id)
  }

  return (
    <div className="relative flex flex-col">
      {plan.recommended && (
        <div className="mb-3 flex justify-center">
          <Badge className="bg-pricing-badge-bg text-pricing-badge-text px-3 py-1 text-sm font-medium">
            Recommendation
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          'flex flex-1 flex-col rounded-sm',
          plan.recommended
            ? 'border-blue-primary shadow-[0px_12px_48px_rgba(0,44,109,0.10)]'
            : 'border-pricing-border'
        )}
      >
        <CardContent className="flex flex-1 flex-col gap-4 p-6">
          {/* Plan Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-text-dark text-base font-medium">
                {plan.title}
              </h3>
              <p className="text-text-light-gray text-sm leading-5 font-normal">
                {plan.description}
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-blue-primary text-4xl font-medium">
                {formatPrice(plan.price)}
              </span>
              <span className="text-text-muted text-base font-normal">
                {formatPeriod(plan.period)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="bg-pricing-divider h-px" />

          {/* Features */}
          <div className="flex flex-1 flex-col gap-3">
            {plan.features.map((feature) => (
              <div key={feature.id} className="flex items-start gap-2">
                <CircleCheck
                  className="text-pricing-feature-icon mt-0.5 h-3.5 w-3.5 shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-pricing-text-body text-sm font-normal">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Button */}
          <Button
            variant={plan.buttonVariant}
            className={cn(
              'mt-3 w-full gap-2 rounded-[3px] px-6 py-3 text-base font-semibold capitalize',
              plan.recommended
                ? 'bg-blue-primary hover:bg-blue-primary/90 text-white'
                : 'border-blue-primary bg-bg-blue-light text-blue-primary hover:bg-bg-blue-light/80'
            )}
            onClick={handleSelectPlan}
          >
            <span>Choose plan</span>
            <ArrowRight className="h-6 w-6" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
