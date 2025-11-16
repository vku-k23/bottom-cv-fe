'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService, Company } from '@/lib/companyService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Image from 'next/image'

interface CompanyFormData {
  name: string
  slug: string
  introduce: string
  phone: string
  email: string
  website: string
  logo: string
  cover: string
  industry: string
  companySize: string
  foundedYear: number
}

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const companyId = Number(params.id)

  const { data: company, isLoading } = useQuery({
    queryKey: ['admin-company', companyId],
    queryFn: () => companyService.getCompanyById(companyId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>()

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || '',
        slug: company.slug || '',
        introduce: company.introduce || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        logo: company.logo || '',
        cover: company.cover || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        foundedYear: company.foundedYear || new Date().getFullYear(),
      })
    }
  }, [company, reset])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Company>) =>
      companyService.updateCompany(companyId, data),
    onSuccess: () => {
      toast.success('Company updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-company', companyId] })
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      router.push(`/admin/companies/${companyId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update company')
    },
  })

  const onSubmit = (data: CompanyFormData) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading company...</p>
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
            onClick={() => router.push(`/admin/companies/${companyId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
            <p className="mt-1 text-gray-600">Update company information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  {...register('name', {
                    required: 'Company name is required',
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug', { required: 'Slug is required' })}
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  {...register('industry', {
                    required: 'Industry is required',
                  })}
                  className={errors.industry ? 'border-red-500' : ''}
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Input
                  id="companySize"
                  {...register('companySize', {
                    required: 'Company size is required',
                  })}
                  className={errors.companySize ? 'border-red-500' : ''}
                />
                {errors.companySize && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.companySize.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="foundedYear">Founded Year *</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  {...register('foundedYear', {
                    required: 'Founded year is required',
                    valueAsNumber: true,
                    min: { value: 1800, message: 'Year must be after 1800' },
                  })}
                  className={errors.foundedYear ? 'border-red-500' : ''}
                />
                {errors.foundedYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.foundedYear.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="introduce">Introduction *</Label>
                <Textarea
                  id="introduce"
                  rows={4}
                  {...register('introduce', {
                    required: 'Introduction is required',
                  })}
                  className={errors.introduce ? 'border-red-500' : ''}
                />
                {errors.introduce && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.introduce.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" {...register('website')} />
              </div>

              <div>
                <Label htmlFor="logo">Logo URL *</Label>
                <Input
                  id="logo"
                  {...register('logo', { required: 'Logo URL is required' })}
                  className={errors.logo ? 'border-red-500' : ''}
                />
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.logo.message}
                  </p>
                )}
                {company?.logo && (
                  <div className="mt-2">
                    <Image
                      src={company.logo}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input id="cover" {...register('cover')} />
                {company?.cover && (
                  <div className="mt-2">
                    <Image
                      src={company.cover}
                      alt="Cover preview"
                      width={800}
                      height={128}
                      className="h-32 w-full rounded object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/companies/${companyId}`)}
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
