'use client'

import { useQuery } from '@tanstack/react-query'
import { paymentService } from '@/lib/paymentService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function PaymentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const paymentId = Number(params.id)

  const {
    data: payment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-payment', paymentId],
    queryFn: () => paymentService.getPaymentById(paymentId),
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading payment...</p>
        </div>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading payment</p>
          <Button
            onClick={() => router.push('/admin/payments')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
        </div>
      </div>
    )
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100)
  }

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase()
    if (upperStatus === 'SUCCESS' || upperStatus === 'COMPLETED')
      return 'default'
    if (upperStatus === 'PENDING') return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/payments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Details
            </h1>
            <p className="mt-1 text-gray-600">Transaction Information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Transaction ID
              </label>
              <p className="mt-1 font-mono text-gray-900">
                {payment.transactionId || `#${payment.id}`}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="mt-1 text-gray-900">#{payment.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Amount
              </label>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatAmount(payment.amount, payment.currency)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Currency
              </label>
              <p className="mt-1 text-gray-900">{payment.currency || 'USD'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Payment Method
              </label>
              <p className="mt-1 text-gray-900">
                {payment.paymentMethod || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-2">
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment.createdAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            {payment.updatedAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated At
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(payment.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
