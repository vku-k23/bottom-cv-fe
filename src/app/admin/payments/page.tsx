'use client'

import { useQuery } from '@tanstack/react-query'
import { paymentService, Payment } from '@/lib/paymentService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { DataTable, Column } from '@/components/admin/shared/DataTable'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export default function PaymentsPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payments', page, pageSize],
    queryFn: () =>
      paymentService.getAllPayments({
        pageNo: page,
        pageSize,
      }),
  })

  const payments = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'FAILED':
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100) // Assuming amount is in cents
  }

  const columns: Column<Payment>[] = [
    {
      key: 'transaction',
      header: t('Admin.payments.transactionId'),
      render: (payment: Payment) => (
        <div>
          <p className="font-medium text-gray-900">
            {payment.transactionId || `#${payment.id}`}
          </p>
          <p className="text-sm text-gray-500">
            {t('Admin.payments.userId')}: {payment.userId}
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: t('Admin.payments.amount'),
      render: (payment: Payment) => (
        <p className="font-medium text-gray-900">
          {formatAmount(payment.amount, payment.currency)}
        </p>
      ),
    },
    {
      key: 'method',
      header: t('Admin.payments.paymentMethod'),
      render: (payment: Payment) => (
        <p className="text-sm text-gray-600">
          {payment.paymentMethod || 'N/A'}
        </p>
      ),
    },
    {
      key: 'status',
      header: t('Admin.payments.status'),
      render: (payment: Payment) => (
        <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
      ),
    },
    {
      key: 'date',
      header: t('Admin.payments.date'),
      render: (payment: Payment) => (
        <p className="text-sm text-gray-600">
          {payment.createdAt
            ? new Date(payment.createdAt).toLocaleDateString()
            : 'N/A'}
        </p>
      ),
    },
    {
      key: 'actions',
      header: t('Admin.payments.actions'),
      render: (payment: Payment) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/payments/${payment.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  // Calculate stats
  const totalRevenue = payments.reduce((sum, p) => {
    if (
      p.status?.toUpperCase() === 'SUCCESS' ||
      p.status?.toUpperCase() === 'COMPLETED'
    ) {
      return sum + p.amount
    }
    return sum
  }, 0)

  const pendingPayments = payments.filter(
    (p) => p.status?.toUpperCase() === 'PENDING'
  ).length

  const completedPayments = payments.filter(
    (p) =>
      p.status?.toUpperCase() === 'SUCCESS' ||
      p.status?.toUpperCase() === 'COMPLETED'
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Admin.payments.title')}
        </h1>
        <p className="mt-1 text-gray-600">{t('Admin.payments.description')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {formatAmount(totalRevenue)}
              </p>
              <p className="text-sm text-gray-600">
                {t('Admin.payments.totalRevenue')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {completedPayments}
              </p>
              <p className="text-sm text-gray-600">
                {t('Admin.payments.completedPayments')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {pendingPayments}
              </p>
              <p className="text-sm text-gray-600">
                {t('Admin.payments.pendingPayments')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t('Admin.payments.paymentTransactions')} ({totalElements})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.payments.loadingPayments')}
              </p>
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-red-500">
                {t('Admin.payments.errorLoadingPayments')}
              </p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.payments.noPaymentsFound')}
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={payments} />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('Admin.common.showing')} {page * pageSize + 1}{' '}
                  {t('Admin.common.to')}{' '}
                  {Math.min((page + 1) * pageSize, totalElements)}{' '}
                  {t('Admin.common.of')} {totalElements}{' '}
                  {t('Admin.common.results')}
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
    </div>
  )
}
