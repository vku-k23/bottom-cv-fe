'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService, Job } from '@/lib/jobService'
import { companyService } from '@/lib/companyService'
import { categoryService } from '@/lib/categoryService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'

interface JobFormData {
  title: string
  jobDescription: string
  jobRequirement: string
  jobBenefit: string
  jobType: string
  location: string
  workTime: string
  salary: number
  careerLevel: string
  qualification: string
  experience: string
  expiryDate: string
  status: string
  companyId: number
  categoryIds: number[]
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const jobId = Number(params.id)

  const { data: job, isLoading } = useQuery({
    queryKey: ['admin-job', jobId],
    queryFn: () => jobService.getJobById(jobId),
  })

  const { data: companies } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: () => companyService.getAllCompanies({ pageNo: 0, pageSize: 100 }),
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: () => categoryService.getAllCategories({ pageNo: 0, pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<JobFormData>()

  useEffect(() => {
    if (job) {
      reset({
        title: job.title || '',
        jobDescription: job.jobDescription || '',
        jobRequirement: job.jobRequirement || '',
        jobBenefit: job.jobBenefit || '',
        jobType: typeof job.jobType === 'string' ? job.jobType : (job.jobType as { name: string })?.name || 'FULL_TIME',
        location: job.location || '',
        workTime: job.workTime || '',
        salary: job.salary || 0,
        careerLevel: job.careerLevel || '',
        qualification: job.qualification || '',
        experience: job.experience || '',
        expiryDate: job.expiryDate
          ? new Date(job.expiryDate).toISOString().split('T')[0]
          : '',
        status:
          typeof job.status === 'string'
            ? job.status
            : (job.status as { name: string } | undefined)?.name || 'PENDING',
        companyId: job.company?.id || job.companyId || 0,
        categoryIds: job.categories?.map((c) => c.id) || job.categoryIds || [],
      })
    }
  }, [job, reset])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Job>) => jobService.updateJob(jobId, data),
    onSuccess: () => {
      toast.success('Job updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-job', jobId] })
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      router.push(`/admin/jobs/${jobId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update job')
    },
  })

  const onSubmit = (data: JobFormData) => {
    updateMutation.mutate({
      ...data,
      salary: data.salary || undefined,
      expiryDate: data.expiryDate
        ? new Date(data.expiryDate).toISOString()
        : undefined,
    } as Partial<Job>)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading job...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/jobs/${jobId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="mt-1 text-gray-600">Update job information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="jobDescription">Description *</Label>
                <Textarea
                  id="jobDescription"
                  rows={4}
                  {...register('jobDescription', {
                    required: 'Description is required',
                  })}
                  className={errors.jobDescription ? 'border-red-500' : ''}
                />
                {errors.jobDescription && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="jobRequirement">Requirements *</Label>
                <Textarea
                  id="jobRequirement"
                  rows={4}
                  {...register('jobRequirement', {
                    required: 'Requirements are required',
                  })}
                  className={errors.jobRequirement ? 'border-red-500' : ''}
                />
                {errors.jobRequirement && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.jobRequirement.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="jobBenefit">Benefits *</Label>
                <Textarea
                  id="jobBenefit"
                  rows={4}
                  {...register('jobBenefit', {
                    required: 'Benefits are required',
                  })}
                  className={errors.jobBenefit ? 'border-red-500' : ''}
                />
                {errors.jobBenefit && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.jobBenefit.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyId">Company *</Label>
                <Controller
                  name="companyId"
                  control={control}
                  rules={{ required: 'Company is required' }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger
                        className={errors.companyId ? 'border-red-500' : ''}
                      >
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

              <div>
                <Label className="mb-2 block">Categories</Label>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-2 rounded-md border p-4 sm:grid-cols-2">
                      {categories?.data.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cat-${cat.id}`}
                            checked={field.value?.includes(cat.id)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), cat.id]
                                : (field.value || []).filter(
                                    (id) => id !== cat.id
                                  )
                              field.onChange(newValue)
                            }}
                          />
                          <Label
                            htmlFor={`cat-${cat.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {cat.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: 'Job type is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.jobType ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="REMOTE">Remote</SelectItem>
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
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location', {
                    required: 'Location is required',
                  })}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="workTime">Work Time *</Label>
                <Input
                  id="workTime"
                  {...register('workTime', {
                    required: 'Work time is required',
                  })}
                  className={errors.workTime ? 'border-red-500' : ''}
                />
                {errors.workTime && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.workTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  {...register('salary', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label htmlFor="careerLevel">Career Level</Label>
                <Input
                  id="careerLevel"
                  {...register('careerLevel')}
                  placeholder="e.g. Senior, Lead"
                />
              </div>

              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  {...register('qualification')}
                  placeholder="e.g. Bachelor's Degree"
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  {...register('experience')}
                  placeholder="e.g. 3+ years"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate')}
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.status ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/jobs/${jobId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
