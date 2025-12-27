'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  variant?: 'default' | 'destructive' | 'warning' | 'success'
  loading?: boolean
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'text-blue-600',
    confirmClass: 'bg-blue-600 hover:bg-blue-700',
  },
  destructive: {
    icon: XCircle,
    iconClass: 'text-red-600',
    confirmClass: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-yellow-600',
    confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    confirmClass: 'bg-green-600 hover:bg-green-700',
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div
              className={`rounded-full p-2 ${config.iconClass.replace('text-', 'bg-').replace('600', '100')}`}
            >
              <Icon className={`h-6 w-6 ${config.iconClass}`} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={config.confirmClass}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
