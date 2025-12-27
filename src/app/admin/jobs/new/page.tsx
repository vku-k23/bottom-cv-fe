'use client'

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { jobService } from '@/lib/jobService'
import { companyService } from '@/lib/companyService'
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
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

interface JobFormData {
  title: string
  jobDescription: string
  jobRequirement: string
  jobBenefit: string
  jobType: string
  location: string
  workTime: string
  salary: number
  expiryDate: string
  status: string
  companyId: number
  categoryIds: number[]
}

export default function NewJobPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: companies } = useQuery({
    queryKey: ['admin-companies-list'],
    queryFn: () => companyService.getAllCompanies({ pageNo: 0, pageSize: 100 }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<JobFormData>({
    defaultValues: {
      status: 'PENDING',
      jobType: 'FULL_TIME',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: JobFormData) =>
      jobService.createJob({
        ...data,
        salary: data.salary || undefined,
        expiryDate: data.expiryDate
          ? new Date(data.expiryDate).toISOString()
          : undefined,
      }),
    onSuccess: (data) => {
      toast.success('Job created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      router.push(`/admin/jobs/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create job')
    },
  })

  const onSubmit = (data: JobFormData) => {
    createMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
            <p className="mt-1 text-gray-600">Add a new job posting</p>
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
            onClick={() => router.push('/admin/jobs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  )
}
