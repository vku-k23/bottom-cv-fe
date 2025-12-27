'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  User,
  Briefcase,
  FileEdit,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { CVResponse, CVRequest } from '@/types/cv'

const cvSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  skills: z.string().min(1, 'Skills are required'),
  experience: z.string().min(1, 'Experience is required'),
  content: z.string().min(1, 'Content is required'),
})

type CVFormData = z.infer<typeof cvSchema>

interface CVFormProps {
  cv?: CVResponse
  onSubmit: (data: CVRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CVForm({
  cv,
  onSubmit,
  onCancel,
  isLoading = false,
}: CVFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: {
      title: cv?.title || '',
      skills: cv?.skills || '',
      experience: cv?.experience || '',
      content: cv?.content || '',
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setFileError('Please select a PDF, DOC, or DOCX file')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB')
      return
    }

    setFileError(null)
    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onFormSubmit = async (data: CVFormData) => {
    if (!selectedFile && !cv) {
      setFileError('Please select a CV file')
      return
    }

    try {
      const cvData: CVRequest = {
        title: data.title,
        cvFile: selectedFile || new File([], 'placeholder'), // This will be handled by the service
        skills: data.skills,
        experience: data.experience,
        content: data.content,
      }

      await onSubmit(cvData)
      toast.success(cv ? 'CV updated successfully' : 'CV created successfully')
    } catch (_error) {
      toast.error(cv ? 'Failed to update CV' : 'Failed to create CV')
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{cv ? 'Edit CV' : 'Create New CV'}</span>
        </CardTitle>
        <CardDescription>
          {cv ? 'Update your CV information' : 'Upload and create a new CV'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              CV Title *
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter CV title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              CV File {!cv && '*'}
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                    <p className="mt-1 text-sm text-gray-500">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {fileError && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {fileError}
              </p>
            )}
          </div>

          {/* Skills Field */}
          <div className="space-y-2">
            <label
              htmlFor="skills"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <User className="mr-1 h-4 w-4" />
              Skills *
            </label>
            <Input
              id="skills"
              {...register('skills')}
              placeholder="e.g., React, Node.js, Python, JavaScript"
              className={errors.skills ? 'border-red-500' : ''}
            />
            {errors.skills && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.skills.message}
              </p>
            )}
          </div>

          {/* Experience Field */}
          <div className="space-y-2">
            <label
              htmlFor="experience"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <Briefcase className="mr-1 h-4 w-4" />
              Experience *
            </label>
            <Input
              id="experience"
              {...register('experience')}
              placeholder="e.g., 3 years of web development experience"
              className={errors.experience ? 'border-red-500' : ''}
            />
            {errors.experience && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FileEdit className="mr-1 h-4 w-4" />
              Additional Content *
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={4}
              className={`w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Any additional information about your CV..."
            />
            {errors.content && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!selectedFile && !cv)}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  {cv ? 'Updating...' : 'Creating...'}
                </>
              ) : cv ? (
                'Update CV'
              ) : (
                'Create CV'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
