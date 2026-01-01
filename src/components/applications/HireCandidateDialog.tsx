'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle, PartyPopper } from 'lucide-react'
import { hiringService } from '@/lib/hiringService'
import { HireCandidateRequest } from '@/types/hiring'
import { ApplyResponse } from '@/lib/applicationService'
import { toast } from 'react-hot-toast'

interface HireCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: ApplyResponse
  jobTitle?: string
  onSuccess?: () => void
}

const CONTRACT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'VND', label: 'VND (₫)' },
  { value: 'GBP', label: 'GBP (£)' },
]

export function HireCandidateDialog({
  open,
  onOpenChange,
  application,
  jobTitle,
  onSuccess,
}: HireCandidateDialogProps) {
  const queryClient = useQueryClient()
  const [showOfferDetails, setShowOfferDetails] = useState(false)
  const [formData, setFormData] = useState({
    note: '',
    salary: '',
    salaryCurrency: 'USD',
    startDate: '',
    position: jobTitle || '',
    department: '',
    contractType: 'FULL_TIME',
    additionalBenefits: '',
    sendOfferEmail: false,
  })

  const candidateName = application.candidateProfile
    ? `${application.candidateProfile.firstName} ${application.candidateProfile.lastName}`
    : `User ${application.userId}`

  const hireMutation = useMutation({
    mutationFn: (request: HireCandidateRequest) =>
      hiringService.hireCandidate(request),
    onSuccess: (data) => {
      toast.success(data.message || 'Candidate hired successfully!')
      queryClient.invalidateQueries({ queryKey: ['applications-grouped'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({
        queryKey: ['application-status-history'],
      })
      onSuccess?.()
      onOpenChange(false)
      resetForm()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to hire candidate')
    },
  })

  const handleSubmit = () => {
    const request: HireCandidateRequest = {
      applicationId: application.id,
      note: formData.note || undefined,
      sendOfferEmail: formData.sendOfferEmail,
    }

    if (showOfferDetails) {
      if (formData.salary) {
        request.salary = parseFloat(formData.salary)
        request.salaryCurrency = formData.salaryCurrency
      }
      if (formData.startDate) {
        request.startDate = formData.startDate
      }
      if (formData.position) {
        request.position = formData.position
      }
      if (formData.department) {
        request.department = formData.department
      }
      if (formData.contractType) {
        request.contractType = formData.contractType
      }
      if (formData.additionalBenefits) {
        request.additionalBenefits = formData.additionalBenefits
      }
    }

    hireMutation.mutate(request)
  }

  const resetForm = () => {
    setFormData({
      note: '',
      salary: '',
      salaryCurrency: 'USD',
      startDate: '',
      position: jobTitle || '',
      department: '',
      contractType: 'FULL_TIME',
      additionalBenefits: '',
      sendOfferEmail: false,
    })
    setShowOfferDetails(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <PartyPopper className="h-6 w-6 text-[#0A65CC]" />
            Hire Candidate
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You are about to hire{' '}
            <strong className="text-gray-900">{candidateName}</strong> for the
            position of{' '}
            <strong className="text-gray-900">{jobTitle || 'this role'}</strong>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Note */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Add any notes about this hiring decision..."
              className="min-h-[80px]"
            />
          </div>

          {/* Offer Details Toggle */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Include Offer Details</p>
              <p className="text-sm text-gray-500">
                Add salary, start date, and other offer information
              </p>
            </div>
            <Switch
              checked={showOfferDetails}
              onCheckedChange={setShowOfferDetails}
            />
          </div>

          {/* Offer Details Form */}
          {showOfferDetails && (
            <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4">
              {/* Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    placeholder="e.g., 50000"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.salaryCurrency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, salaryCurrency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              {/* Position & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>

              {/* Contract Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="contractType">Contract Type</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, contractType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Benefits */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="benefits">Additional Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.additionalBenefits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalBenefits: e.target.value,
                    })
                  }
                  placeholder="e.g., Health insurance, flexible hours, remote work..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}

          {/* Send Offer Email */}
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Send Offer Email</p>
              <p className="text-sm text-gray-500">
                Automatically send an offer email to the candidate
              </p>
            </div>
            <Switch
              checked={formData.sendOfferEmail}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sendOfferEmail: checked })
              }
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false)
              resetForm()
            }}
            disabled={hireMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            className="bg-[#0A65CC] text-white hover:bg-[#0855B3]"
            disabled={hireMutation.isPending}
          >
            {hireMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Hire
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
