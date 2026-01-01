'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateColumnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string) => Promise<void>
  existingColumnNames: string[]
}

export function CreateColumnModal({
  open,
  onOpenChange,
  onSubmit,
  existingColumnNames,
}: CreateColumnModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate empty
    if (!name.trim()) {
      setError('Column name is required')
      return
    }

    // Validate duplicate
    if (
      existingColumnNames.some(
        (n) => n.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      setError('A column with this name already exists')
      return
    }

    // Validate length
    if (name.trim().length > 100) {
      setError('Column name must be less than 100 characters')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(name.trim())
      setName('')
      setError('')
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create column')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setName('')
      setError('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Column</DialogTitle>
          <DialogDescription>
            Enter a name for the new status column. This column will be saved to
            the database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Column Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="e.g., Interview, Offer, Rejected"
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Column'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
