'use client'

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
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
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'

interface CompanyFormData {
  name: string
  slug: string
  introduce: string
  phone?: string
  email?: string
  website?: string
  logo: string
  cover?: string
  industry: string
  companySize: string
  foundedYear: number
  socialMediaLinks?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  addresses?: {
    main?: string
    branch?: string
  }
}

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
]

const INDUSTRIES = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Media', label: 'Media' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Other', label: 'Other' },
]

export default function CompanyProfilePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { fetchCurrentUser } = useAuthStore()

  // Get employer's company ID from user object
  const employerCompanyId = (user as { company?: { id: number } })?.company?.id

  // Fetch existing company if employer has one
  const { data: existingCompany, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['employer-company', employerCompanyId],
    queryFn: () => companyService.getCompanyById(employerCompanyId!),
    enabled: !!employerCompanyId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CompanyFormData>({
    defaultValues: {
      logo: '',
      socialMediaLinks: {},
      addresses: {},
    },
  })

  // Populate form when company data is loaded
  useEffect(() => {
    if (existingCompany) {
      reset({
        name: existingCompany.name || '',
        slug: existingCompany.slug || '',
        introduce: existingCompany.introduce || '',
        phone: existingCompany.phone || '',
        email: existingCompany.email || '',
        website: existingCompany.website || '',
        logo: existingCompany.logo || '',
        cover: existingCompany.cover || '',
        industry: existingCompany.industry || '',
        companySize: existingCompany.companySize || '',
        foundedYear: existingCompany.foundedYear || new Date().getFullYear(),
        socialMediaLinks: existingCompany.socialMediaLinks || {},
        addresses: existingCompany.addresses || {},
      })
    }
  }, [existingCompany, reset])

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const createMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const companyRequest = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        introduce: data.introduce,
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        logo: data.logo || 'https://via.placeholder.com/150',
        cover: data.cover || undefined,
        industry: data.industry,
        companySize: data.companySize,
        foundedYear: data.foundedYear,
        socialMediaLinks: data.socialMediaLinks || undefined,
        addresses: data.addresses || undefined,
      }
      return companyService.createCompany(companyRequest)
    },
    onSuccess: async () => {
      toast.success('Company profile created successfully!')
      queryClient.invalidateQueries({ queryKey: ['employer-company'] })
      queryClient.invalidateQueries({ queryKey: ['admin-companies-list'] })
      // Refresh user data to get the new company assignment
      await fetchCurrentUser(true)
      router.push('/admin')
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create company'
      toast.error(message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      if (!employerCompanyId) throw new Error('Company ID is required')
      const companyRequest = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        introduce: data.introduce,
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        logo: data.logo || 'https://via.placeholder.com/150',
        cover: data.cover || undefined,
        industry: data.industry,
        companySize: data.companySize,
        foundedYear: data.foundedYear,
        socialMediaLinks: data.socialMediaLinks || undefined,
        addresses: data.addresses || undefined,
      }
      return companyService.updateCompany(employerCompanyId, companyRequest)
    },
    onSuccess: () => {
      toast.success('Company profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['employer-company'] })
      queryClient.invalidateQueries({ queryKey: ['admin-companies-list'] })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to update company'
      toast.error(message)
    },
  })

  const onSubmit = (data: CompanyFormData) => {
    if (existingCompany) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isLoadingCompany) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">
            Loading company profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {existingCompany ? 'Edit Company Profile' : 'Create Company Profile'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {existingCompany
            ? 'Update your company information'
            : 'Set up your company profile to start posting jobs'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Acme Corporation"
                className="mt-1.5 h-11"
                {...register('name', {
                  required: 'Company name is required',
                  minLength: {
                    value: 3,
                    message: 'Company name must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Company name must be less than 100 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="text-sm font-medium">
                Company Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="e.g. acme-corporation"
                className="mt-1.5 h-11"
                {...register('slug', {
                  required: 'Slug is required',
                })}
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly identifier (auto-generated from name if left empty)
              </p>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Introduction */}
            <div>
              <Label htmlFor="introduce" className="text-sm font-medium">
                Company Introduction <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="introduce"
                placeholder="Describe your company, its mission, values, and what makes it unique..."
                className="mt-1.5 min-h-[120px] resize-none"
                {...register('introduce', {
                  required: 'Introduction is required',
                  maxLength: {
                    value: 500,
                    message: 'Introduction must be less than 500 characters',
                  },
                })}
              />
              {errors.introduce && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.introduce.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Industry */}
              <div>
                <Label htmlFor="industry" className="text-sm font-medium">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="industry"
                  control={control}
                  rules={{ required: 'Industry is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <Label htmlFor="companySize" className="text-sm font-medium">
                  Company Size <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companySize"
                  control={control}
                  rules={{ required: 'Company size is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 h-11">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.companySize && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.companySize.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Founded Year */}
              <div>
                <Label htmlFor="foundedYear" className="text-sm font-medium">
                  Founded Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="foundedYear"
                  type="number"
                  placeholder="e.g. 2020"
                  className="mt-1.5 h-11"
                  {...register('foundedYear', {
                    required: 'Founded year is required',
                    valueAsNumber: true,
                    min: {
                      value: 1800,
                      message: 'Founded year must be after 1800',
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: 'Founded year cannot be in the future',
                    },
                  })}
                />
                {errors.foundedYear && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.foundedYear.message}
                  </p>
                )}
              </div>

              {/* Logo URL */}
              <div>
                <Label htmlFor="logo" className="text-sm font-medium">
                  Logo URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="logo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className="mt-1.5 h-11"
                  {...register('logo', {
                    required: 'Logo URL is required',
                  })}
                />
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.logo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <Label htmlFor="cover" className="text-sm font-medium">
                Cover Image URL
              </Label>
              <Input
                id="cover"
                type="url"
                placeholder="https://example.com/cover.jpg"
                className="mt-1.5 h-11"
                {...register('cover')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 0123456789"
                  className="mt-1.5 h-11"
                  {...register('phone', {
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message:
                        'Phone number must contain only digits and be between 10-15 characters',
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  className="mt-1.5 h-11"
                  {...register('email', {
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email format',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website" className="text-sm font-medium">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://www.company.com"
                className="mt-1.5 h-11"
                {...register('website')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Addresses Card */}
        <Card>
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
            <p className="text-sm font-normal text-gray-600">
              Optional: Add company addresses
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mainAddress" className="text-sm font-medium">
                Main Address
              </Label>
              <Input
                id="mainAddress"
                placeholder="e.g. 123 Main Street, City, Country"
                className="mt-1.5 h-11"
                {...register('addresses.main')}
              />
            </div>
            <div>
              <Label htmlFor="branchAddress" className="text-sm font-medium">
                Branch Address (Optional)
              </Label>
              <Input
                id="branchAddress"
                placeholder="e.g. 456 Branch Avenue, City, Country"
                className="mt-1.5 h-11"
                {...register('addresses.branch')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Card */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <p className="text-sm font-normal text-gray-600">
              Optional: Add your social media profiles
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="facebook" className="text-sm font-medium">
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://facebook.com/yourcompany"
                  className="mt-1.5 h-11"
                  {...register('socialMediaLinks.facebook')}
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-sm font-medium">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="mt-1.5 h-11"
                  {...register('socialMediaLinks.linkedin')}
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-sm font-medium">
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/yourcompany"
                  className="mt-1.5 h-11"
                  {...register('socialMediaLinks.twitter')}
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-sm font-medium">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/yourcompany"
                  className="mt-1.5 h-11"
                  {...register('socialMediaLinks.instagram')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-11 px-8"
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {existingCompany ? 'Update Company' : 'Create Company'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
