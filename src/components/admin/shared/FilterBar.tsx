'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  type: 'search' | 'select' | 'date'
  placeholder?: string
  options?: FilterOption[]
  value?: string
  onChange: (value: string) => void
}

interface FilterBarProps {
  filters: Record<string, FilterConfig>
  onReset?: () => void
}

export function FilterBar({ filters, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white p-4">
      {Object.entries(filters).map(([key, config]) => {
        if (config.type === 'search') {
          return (
            <div key={key} className="relative min-w-[200px] flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={config.placeholder || 'Search...'}
                value={config.value || ''}
                onChange={(e) => config.onChange(e.target.value)}
                className="pl-9"
              />
            </div>
          )
        }

        if (config.type === 'select') {
          // Convert empty string to special value for Select component
          const selectValue =
            config.value === '' || !config.value ? '__ALL__' : config.value

          return (
            <Select
              key={key}
              value={selectValue}
              onValueChange={(value) => {
                // Convert special "all" value back to empty string/undefined
                const finalValue = value === '__ALL__' ? '' : value
                config.onChange(finalValue)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={config.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {config.options?.map((option) => {
                  // Use special value for empty strings
                  const optionValue =
                    option.value === '' ? '__ALL__' : option.value
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {option.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }

        return null
      })}

      {onReset && (
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  )
}
