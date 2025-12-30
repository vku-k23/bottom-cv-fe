'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { applicationService } from '@/lib/applicationService'
import { toast } from 'react-hot-toast'
import { UploadCloud, FileIcon, X } from 'lucide-react'

interface ApplyJobModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: number
  jobTitle: string
}

interface ApplyForm {
  coverLetter: string
}

export function ApplyJobModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: ApplyJobModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors: _errors },
    reset,
  } = useForm<ApplyForm>()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      // Validate file type
      if (
        ![
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        toast.error('Only PDF and Word documents are allowed')
        return
      }
      setSelectedFile(file)
    }
  }

  const onSubmit = async (data: ApplyForm) => {
    if (!selectedFile) {
      toast.error('Please upload your CV/Resume')
      return
    }

    setIsSubmitting(true)
    try {
      await applicationService.submitApplication({
        jobId,
        coverLetter: data.coverLetter,
        cvFile: selectedFile,
      })
      toast.success('Application submitted successfully!')
      reset()
      setSelectedFile(null)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Apply Job: {jobTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="cv-upload" className="text-base font-medium">
              Upload CV/Resume <span className="text-red-500">*</span>
            </Label>

            {!selectedFile ? (
              <div className="border-border-gray hover:bg-bg-gray mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors">
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="cv-upload"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <UploadCloud className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="text-blue-600">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </Label>
              </div>
            ) : (
              <div className="bg-bg-gray mt-2 flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-red-100 p-2">
                    <FileIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-base font-medium">
              Cover Letter
            </Label>
            <Textarea
              id="coverLetter"
              rows={6}
              placeholder="Write down your biography here. Let the employers know who you are..."
              className="resize-none"
              {...register('coverLetter')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Apply Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
