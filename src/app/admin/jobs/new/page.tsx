'use client'

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { jobService } from '@/lib/jobService'
import { categoryService } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { companyService } from '@/lib/companyService'

interface JobFormData {
  title: string
  jobDescription: string
  jobRequirement: string
  jobBenefit: string
  jobType: string
  location: string
  workTime: string
  salary?: number
  careerLevel?: string
  qualification?: string
  experience?: string
  expiryDate?: string
  companyId: number
  categoryIds?: number[]
}

const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'REMOTE', label: 'Remote' },
]

const EDUCATION_LEVELS = [
  { value: 'HIGH_SCHOOL', label: 'High School' },
  { value: 'ASSOCIATE', label: 'Associate Degree' },
  { value: 'BACHELOR', label: "Bachelor's Degree" },
  { value: 'MASTER', label: "Master's Degree" },
  { value: 'PHD', label: 'PhD' },
  { value: 'NONE', label: 'No Education Required' },
]

const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level (0-2 years)' },
  { value: 'MID', label: 'Mid Level (3-5 years)' },
  { value: 'SENIOR', label: 'Senior Level (6-10 years)' },
  { value: 'EXECUTIVE', label: 'Executive (10+ years)' },
]

const JOB_LEVELS = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'DIRECTOR', label: 'Director' },
]

export default function PostJobPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Check if user is ADMIN or EMPLOYER
  const isAdmin = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return roleName === 'ADMIN'
  })

  const isEmployer = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return roleName === 'EMPLOYER'
  })

  // Get employer's company ID from user object
  // Backend should now include company in UserResponse after our updates
  const employerCompanyId = (user as { company?: { id: number } })?.company?.id

  // Fetch companies list for ADMIN
  const { data: companies } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: () => companyService.getAllCompanies({ pageNo: 0, pageSize: 100 }),
    enabled: isAdmin === true,
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () =>
      categoryService.getAllCategories({ pageNo: 0, pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<JobFormData>({
    defaultValues: {
      jobType: 'FULL_TIME',
      categoryIds: [],
      companyId: isAdmin ? undefined : employerCompanyId,
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const jobRequest = {
        title: data.title,
        jobDescription: data.jobDescription,
        jobRequirement: data.jobRequirement,
        jobBenefit: data.jobBenefit,
        jobType: data.jobType,
        location: data.location,
        workTime: data.workTime,
        salary: data.salary || undefined,
        careerLevel: data.careerLevel || undefined,
        qualification: data.qualification || undefined,
        experience: data.experience || undefined,
        expiryDate: data.expiryDate
          ? new Date(data.expiryDate).toISOString()
          : undefined,
        status: 'PENDING' as const,
        companyId: data.companyId,
        categoryIds:
          data.categoryIds && data.categoryIds.length > 0
            ? data.categoryIds
            : undefined,
      }
      return jobService.createJob(jobRequest)
    },
    onSuccess: () => {
      toast.success('Job posted successfully!')
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      router.push('/admin/jobs')
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to post job'
      toast.error(message)
    },
  })

  const onSubmit = (data: JobFormData) => {
    const finalCompanyId = isEmployer ? employerCompanyId : data.companyId

    if (!finalCompanyId) {
      if (isEmployer) {
        toast.error('Please set up your company profile first')
        router.push('/admin/company-profile')
      } else {
        toast.error('Please select a company')
      }
      return
    }
    createMutation.mutate({ ...data, companyId: finalCompanyId })
  }

  // Show error if employer doesn't have company
  if (isEmployer && !employerCompanyId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Company Profile Required
            </h2>
            <p className="mb-6 text-gray-600">
              You need to set up your company profile before posting jobs.
            </p>
            <Button onClick={() => router.push('/admin/company-profile')}>
              Go to Company Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Post a Job</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new job posting for your company
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Selector for ADMIN */}
            {isAdmin && (
              <div>
                <Label htmlFor="companyId" className="text-sm font-medium">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companyId"
                  control={control}
                  rules={{ required: 'Company is required' }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies?.data.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.companyId.message}
                  </p>
                )}
              </div>
            )}

            {/* Job Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                className="mt-1.5 h-11"
                {...register('title', { required: 'Job title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Job Type and Location */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="jobType" className="text-sm font-medium">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: 'Job type is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobType && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.jobType.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Ho Chi Minh City, Vietnam"
                  className="mt-1.5 h-11"
                  {...register('location', {
                    required: 'Location is required',
                  })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Work Time */}
            <div>
              <Label htmlFor="workTime" className="text-sm font-medium">
                Work Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workTime"
                placeholder="e.g. 9:00 AM - 6:00 PM, Monday to Friday"
                className="mt-1.5 h-11"
                {...register('workTime', {
                  required: 'Work time is required',
                })}
              />
              {errors.workTime && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.workTime.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <Label htmlFor="jobDescription" className="text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Describe the role, responsibilities, and what makes this position unique..."
                className="mt-1.5 min-h-[120px] resize-none"
                {...register('jobDescription', {
                  required: 'Description is required',
                })}
              />
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="jobRequirement" className="text-sm font-medium">
                Job Requirements <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobRequirement"
                placeholder="List the required skills, qualifications, and experience..."
                className="mt-1.5 min-h-[120px] resize-none"
                {...register('jobRequirement', {
                  required: 'Requirements are required',
                })}
              />
              {errors.jobRequirement && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.jobRequirement.message}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div>
              <Label htmlFor="jobBenefit" className="text-sm font-medium">
                Job Benefits <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobBenefit"
                placeholder="Describe the benefits and perks offered..."
                className="mt-1.5 min-h-[120px] resize-none"
                {...register('jobBenefit', {
                  required: 'Job benefits are required',
                })}
              />
              {errors.jobBenefit && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.jobBenefit.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <p className="text-sm font-normal text-gray-600">
              Optional fields to provide more details about the position
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Salary */}
              <div>
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="salary"
                    type="number"
                    placeholder="Enter salary amount"
                    className="h-11 pr-16"
                    {...register('salary', { valueAsNumber: true })}
                  />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 rounded bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
                    USD
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiration Date
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  className="mt-1.5 h-11"
                  {...register('expiryDate')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Career Level */}
              <div>
                <Label htmlFor="careerLevel" className="text-sm font-medium">
                  Career Level
                </Label>
                <Controller
                  name="careerLevel"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Qualification */}
              <div>
                <Label htmlFor="qualification" className="text-sm font-medium">
                  Education
                </Label>
                <Controller
                  name="qualification"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((edu) => (
                          <SelectItem key={edu.value} value={edu.value}>
                            {edu.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience" className="text-sm font-medium">
                  Experience
                </Label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((exp) => (
                          <SelectItem key={exp.value} value={exp.value}>
                            {exp.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Card */}
        {categories && categories.data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <p className="text-sm font-normal text-gray-600">
                Select relevant categories for this job posting
              </p>
            </CardHeader>
            <CardContent>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3 rounded-lg border p-4 md:grid-cols-3 lg:grid-cols-4">
                    {categories.data.map((cat) => (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cat-${cat.id}`}
                          checked={field.value?.includes(cat.id) || false}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...(field.value || []), cat.id]
                              : (field.value || []).filter(
                                  (id) => id !== cat.id
                                )
                            field.onChange(newValue)
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label
                          htmlFor={`cat-${cat.id}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {cat.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={createMutation.isPending}
            className="h-11 px-8"
          >
            {createMutation.isPending ? (
              'Posting...'
            ) : (
              <>
                Post Job
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
