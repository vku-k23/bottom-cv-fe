import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface ApplicationStatusProps {
  status:
    | 'pending'
    | 'reviewed'
    | 'shortlisted'
    | 'interview'
    | 'rejected'
    | 'accepted'
  className?: string
}

export function ApplicationStatus({
  status,
  className,
}: ApplicationStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconClassName: 'text-yellow-600',
        }
      case 'reviewed':
        return {
          label: 'Under Review',
          icon: AlertCircle,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          iconClassName: 'text-blue-600',
        }
      case 'shortlisted':
        return {
          label: 'Shortlisted',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200',
          iconClassName: 'text-green-600',
        }
      case 'interview':
        return {
          label: 'Interview Scheduled',
          icon: Clock,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          iconClassName: 'text-purple-600',
        }
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className: 'bg-red-100 text-red-800 border-red-200',
          iconClassName: 'text-red-600',
        }
      case 'accepted':
        return {
          label: 'Accepted',
          icon: CheckCircle,
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconClassName: 'text-emerald-600',
        }
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          iconClassName: 'text-gray-600',
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      className={`inline-flex items-center space-x-1 border ${config.className} ${className}`}
    >
      <Icon className={`h-3 w-3 ${config.iconClassName}`} />
      <span>{config.label}</span>
    </Badge>
  )
}

export function ApplicationStatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'Applied', completed: true },
    {
      key: 'reviewed',
      label: 'Under Review',
      completed: [
        'reviewed',
        'shortlisted',
        'interview',
        'accepted',
        'rejected',
      ].includes(status),
    },
    {
      key: 'shortlisted',
      label: 'Shortlisted',
      completed: ['shortlisted', 'interview', 'accepted', 'rejected'].includes(
        status
      ),
    },
    {
      key: 'interview',
      label: 'Interview',
      completed: ['interview', 'accepted', 'rejected'].includes(status),
    },
    {
      key: 'final',
      label: 'Decision',
      completed: ['accepted', 'rejected'].includes(status),
    },
  ]

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              step.completed
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-gray-300 bg-white text-gray-400'
            }`}
          >
            {step.completed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <span
            className={`ml-2 text-sm ${
              step.completed ? 'font-medium text-green-600' : 'text-gray-500'
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`mx-2 h-0.5 w-8 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
