'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService, Company } from '@/lib/companyService'
import { companyVerificationService } from '@/lib/companyVerificationService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building, Check, X, Eye, Trash2, Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { FilterBar, FilterConfig } from '@/components/admin/shared/FilterBar'
import { DataTable, Column } from '@/components/admin/shared/DataTable'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function CompaniesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [verified, setVerified] = useState<boolean | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-companies', page, pageSize, search, industry, verified],
    queryFn: () =>
      companyService.getAllCompanies({
        pageNo: page,
        pageSize,
        search: search || undefined,
        industry: industry || undefined,
        verified,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
  })

  const companies = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: (id: number) =>
      companyVerificationService.verifyCompany(id, {
        notes: 'Verified by admin',
      }),
    onSuccess: () => {
      toast.success(t('Admin.companies.companyVerifiedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      setVerifyDialogOpen(false)
      setSelectedCompany(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || t('Admin.companies.companyVerifiedError'))
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      companyVerificationService.rejectVerification(id, { notes }),
    onSuccess: () => {
      toast.success(t('Admin.companies.companyRejectedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      setRejectDialogOpen(false)
      setSelectedCompany(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || t('Admin.companies.companyRejectedError'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => companyService.deleteCompany(id),
    onSuccess: () => {
      toast.success(t('Admin.companies.companyDeletedSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      setDeleteDialogOpen(false)
      setSelectedCompany(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || t('Admin.companies.companyDeletedError'))
    },
  })

  const handleVerify = (company: Company) => {
    setSelectedCompany(company)
    setVerifyDialogOpen(true)
  }

  const handleReject = (company: Company) => {
    setSelectedCompany(company)
    setRejectDialogOpen(true)
  }

  const handleDelete = (company: Company) => {
    setSelectedCompany(company)
    setDeleteDialogOpen(true)
  }

  const confirmVerify = () => {
    if (selectedCompany) {
      verifyMutation.mutate(selectedCompany.id)
    }
  }

  const confirmReject = () => {
    if (selectedCompany) {
      const notes = prompt(t('Admin.companies.provideRejectionReason'))
      if (notes) {
        rejectMutation.mutate({ id: selectedCompany.id, notes })
      }
    }
  }

  const confirmDelete = () => {
    if (selectedCompany) {
      deleteMutation.mutate(selectedCompany.id)
    }
  }

  const filters: Record<string, FilterConfig> = {
    search: {
      type: 'search',
      placeholder: t('Admin.companies.searchPlaceholder'),
      value: search,
      onChange: setSearch,
    },
    industry: {
      type: 'select',
      placeholder: t('Admin.companies.allIndustries'),
      value: industry,
      onChange: setIndustry,
      options: [
        { label: t('Admin.companies.allIndustries'), value: '' },
        { label: t('Admin.companies.technology'), value: 'Technology' },
        { label: t('Admin.companies.finance'), value: 'Finance' },
        { label: t('Admin.companies.healthcare'), value: 'Healthcare' },
        { label: t('Admin.companies.education'), value: 'Education' },
        { label: t('Admin.companies.retail'), value: 'Retail' },
        { label: t('Admin.companies.manufacturing'), value: 'Manufacturing' },
      ],
    },
    verified: {
      type: 'select',
      placeholder: t('Admin.companies.allStatus'),
      value: verified === undefined ? '' : verified.toString(),
      onChange: (value) => {
        if (value === '') setVerified(undefined)
        else setVerified(value === 'true')
      },
      options: [
        { label: t('Admin.companies.allStatus'), value: '' },
        { label: t('Admin.companies.verified'), value: 'true' },
        { label: t('Admin.companies.notVerified'), value: 'false' },
      ],
    },
  }

  const handleReset = () => {
    setSearch('')
    setIndustry('')
    setVerified(undefined)
    setPage(0)
  }

  const columns: Column<Company>[] = [
    {
      key: 'company',
      header: t('Admin.companies.companyName'),
      render: (company: Company) => (
        <div className="flex items-center space-x-3">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{company.name}</p>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: t('Admin.companies.contact'),
      render: (company: Company) => (
        <div className="text-sm">
          <p className="text-gray-900">{company.email || 'N/A'}</p>
          <p className="text-gray-500">{company.phone || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'size',
      header: t('Admin.companies.size'),
      render: (company: Company) => (
        <span className="text-sm text-gray-600">{company.companySize}</span>
      ),
    },
    {
      key: 'jobs',
      header: t('Admin.companies.jobs'),
      render: (company: Company) => (
        <span className="text-sm font-medium text-gray-900">
          {company.jobCount || company.jobs?.length || 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('Admin.companies.status'),
      render: (company: Company) => {
        const isVerified =
          company.verified === true ||
          (typeof company.verified === 'number' && company.verified === 1)
        return (
          <Badge variant={isVerified ? 'default' : 'secondary'}>
            {isVerified ? t('Admin.companies.verified') : t('Admin.companies.pending')}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: t('Admin.companies.actions'),
      render: (company: Company) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/companies/${company.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/companies/${company.id}/edit`)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {!(
            company.verified === true ||
            (typeof company.verified === 'number' && company.verified === 1)
          ) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                title="Verify"
                onClick={() => handleVerify(company)}
                disabled={verifyMutation.isPending}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title="Reject"
                onClick={() => handleReject(company)}
                disabled={rejectMutation.isPending}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            title="Delete"
            onClick={() => handleDelete(company)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('Admin.companies.title')}
          </h1>
          <p className="mt-1 text-gray-600">
            {t('Admin.companies.description')}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/companies/new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('Admin.companies.addCompany')}
        </Button>
      </div>

      <FilterBar filters={filters} onReset={handleReset} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('Admin.sidebar.companies')} ({totalElements})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">{t('Admin.companies.loadingCompanies')}</p>
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-red-500">{t('Admin.companies.errorLoadingCompanies')}</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">{t('Admin.companies.noCompaniesFound')}</p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={companies} />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('Admin.common.showing')} {page * pageSize + 1} {t('Admin.common.to')}{' '}
                  {Math.min((page + 1) * pageSize, totalElements)} {t('Admin.common.of')}{' '}
                  {totalElements} {t('Admin.sidebar.companies').toLowerCase()}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    {t('Admin.common.previous')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    {t('Admin.common.next')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('Admin.companies.deleteCompany')}
        description={t('Admin.companies.deleteCompanyConfirm')}
        onConfirm={confirmDelete}
        confirmText={t('Admin.companies.delete')}
        variant="destructive"
      />

      {/* Verify Confirmation Dialog */}
      <ConfirmDialog
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        title={t('Admin.companies.verifyCompany')}
        description={t('Admin.companies.verifyCompanyConfirm')}
        onConfirm={confirmVerify}
        confirmText={t('Admin.companies.verify')}
        variant="default"
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title={t('Admin.companies.rejectVerification')}
        description={t('Admin.companies.rejectVerificationConfirm')}
        onConfirm={confirmReject}
        confirmText={t('Admin.jobs.reject')}
        variant="destructive"
      />
    </div>
  )
}
