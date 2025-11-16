'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export interface BulkAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline'
  icon?: React.ReactNode
  disabled?: boolean
}

interface BulkActionBarProps {
  selectedCount: number
  actions: BulkAction[]
  onClear: () => void
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
      <div className="flex items-center space-x-4 rounded-lg border bg-white px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {selectedCount} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex items-center space-x-1"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
