import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Building, DollarSign } from 'lucide-react'

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  postedAt: string
  description?: string
  tags?: string[]
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
}

export function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  description,
  tags = [],
  onApply,
  onViewDetails,
}: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-800'
      case 'part-time':
        return 'bg-blue-100 text-blue-800'
      case 'contract':
        return 'bg-purple-100 text-purple-800'
      case 'internship':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {title}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="h-4 w-4" />
              <span>{company}</span>
            </div>
          </div>
          <Badge className={getTypeColor(type)}>
            {type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          {salary && (
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{salary}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{postedAt}</span>
          </div>
        </div>

        {description && (
          <p className="line-clamp-2 text-sm text-gray-700">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(id)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button size="sm" onClick={() => onApply?.(id)} className="flex-1">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
