'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Send,
  X,
  Paperclip,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { emailService } from '@/lib/emailService'
import { EmailTemplateType, SendEmailRequest } from '@/types/email'
import { ApplyResponse } from '@/lib/applicationService'
import { toast } from 'react-hot-toast'

interface SendEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: ApplyResponse
  jobTitle?: string
  companyName?: string
  onSuccess?: () => void
}

const TEMPLATE_TYPE_LABELS: Record<EmailTemplateType, string> = {
  INTERVIEW: 'Interview Invitation',
  OFFER: 'Job Offer',
  REJECTION: 'Application Rejection',
  CUSTOM: 'Custom Email',
}

export function SendEmailModal({
  open,
  onOpenChange,
  application,
  jobTitle,
  companyName,
  onSuccess,
}: SendEmailModalProps) {
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<EmailTemplateType>('CUSTOM')
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  )
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
  })

  // Get candidate email from profile
  const candidateEmail = application.candidateProfile?.email || ''
  const candidateName = application.candidateProfile
    ? `${application.candidateProfile.firstName} ${application.candidateProfile.lastName}`
    : `User ${application.userId}`

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: () => emailService.getTemplates(),
    enabled: open,
  })

  // Initialize form with candidate email
  useEffect(() => {
    if (open && candidateEmail) {
      setFormData((prev) => ({
        ...prev,
        to: candidateEmail,
      }))
    }
  }, [open, candidateEmail])

  // Filter templates by type
  const filteredTemplates =
    templates?.filter((t) => t.type === selectedTemplateType) || []

  // Render template mutation
  const renderTemplateMutation = useMutation({
    mutationFn: ({
      templateId,
      applicationId,
    }: {
      templateId: number
      applicationId: number
    }) => emailService.renderTemplate(templateId, applicationId),
    onSuccess: (data) => {
      setFormData((prev) => ({
        ...prev,
        subject: data.subject,
        content: data.content,
      }))
      toast.success('Template loaded successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to load template')
    },
  })

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: (request: SendEmailRequest) => emailService.sendEmail(request),
    onSuccess: (data) => {
      if (data.status === 'SENT') {
        toast.success('Email sent successfully!')
      } else if (data.status === 'FAILED') {
        toast.error(`Failed to send email: ${data.errorMessage}`)
      } else {
        toast.success('Email queued for sending')
      }
      onSuccess?.()
      onOpenChange(false)
      resetForm()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send email')
    },
  })

  const handleTemplateTypeChange = (type: EmailTemplateType) => {
    setSelectedTemplateType(type)
    setSelectedTemplateId(null)
    // Clear content when changing type
    if (type === 'CUSTOM') {
      setFormData((prev) => ({
        ...prev,
        subject: `Regarding Your Application - ${jobTitle || 'Position'}`,
        content: `<p>Dear ${candidateName},</p>\n\n<p></p>\n\n<p>Best regards,<br/>${companyName || 'The Hiring Team'}</p>`,
      }))
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const id = parseInt(templateId)
    setSelectedTemplateId(id)
    renderTemplateMutation.mutate({
      templateId: id,
      applicationId: application.id,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.to || !formData.subject || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    const request: SendEmailRequest = {
      to: formData.to,
      cc: formData.cc
        ? formData.cc
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)
        : undefined,
      bcc: formData.bcc
        ? formData.bcc
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)
        : undefined,
      subject: formData.subject,
      content: formData.content,
      templateType: selectedTemplateType,
      templateId: selectedTemplateId || undefined,
      applicationId: application.id,
    }

    sendEmailMutation.mutate(request)
  }

  const resetForm = () => {
    setFormData({
      to: candidateEmail,
      cc: '',
      bcc: '',
      subject: '',
      content: '',
    })
    setSelectedTemplateType('CUSTOM')
    setSelectedTemplateId(null)
    setShowCcBcc(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-[#0A65CC]" />
            Send Email to Candidate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Template Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="templateType">Template Type</Label>
              <Select
                value={selectedTemplateType}
                onValueChange={(value) =>
                  handleTemplateTypeChange(value as EmailTemplateType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEMPLATE_TYPE_LABELS).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={selectedTemplateId?.toString() || ''}
                onValueChange={handleTemplateSelect}
                disabled={templatesLoading || filteredTemplates.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      templatesLoading
                        ? 'Loading...'
                        : filteredTemplates.length === 0
                          ? 'No templates available'
                          : 'Select a template'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="to">
              To <span className="text-red-500">*</span>
            </Label>
            <Input
              id="to"
              type="email"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="recipient@example.com"
              className="bg-gray-50"
              readOnly
            />
          </div>

          {/* CC/BCC Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit text-gray-500 hover:text-gray-700"
            onClick={() => setShowCcBcc(!showCcBcc)}
          >
            {showCcBcc ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" /> Hide CC/BCC
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" /> Add CC/BCC
              </>
            )}
          </Button>

          {/* CC/BCC Fields */}
          {showCcBcc && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  type="text"
                  value={formData.cc}
                  onChange={(e) =>
                    setFormData({ ...formData, cc: e.target.value })
                  }
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bcc">BCC</Label>
                <Input
                  id="bcc"
                  type="text"
                  value={formData.bcc}
                  onChange={(e) =>
                    setFormData({ ...formData, bcc: e.target.value })
                  }
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Email subject"
            />
          </div>

          {/* Content Field - Rich Text Area */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <div className="rounded-lg border border-gray-200">
              {/* Simple toolbar hint */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span>HTML supported:</span>
                <code className="rounded bg-gray-200 px-1">&lt;p&gt;</code>
                <code className="rounded bg-gray-200 px-1">&lt;strong&gt;</code>
                <code className="rounded bg-gray-200 px-1">&lt;br/&gt;</code>
                <code className="rounded bg-gray-200 px-1">&lt;ul&gt;</code>
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your email content here... (HTML supported)"
                className="min-h-[250px] resize-none border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Attachments - Placeholder */}
          <div className="flex flex-col gap-2">
            <Label>Attachments</Label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 p-4">
              <Paperclip className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                Attachment support coming soon...
              </span>
            </div>
          </div>

          {/* Preview */}
          {formData.content && (
            <div className="flex flex-col gap-2">
              <Label>Preview</Label>
              <div
                className="max-h-[200px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={sendEmailMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0A65CC] text-white hover:bg-[#0855B3]"
              disabled={
                sendEmailMutation.isPending || renderTemplateMutation.isPending
              }
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
