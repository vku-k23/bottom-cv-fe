'use client'

import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/lib/reportService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export default function ReportDetailPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const reportId = Number(params.id)

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-report', reportId],
    queryFn: () => reportService.getReportById(reportId),
  })

  const resolveMutation = useMutation({
    mutationFn: () => reportService.resolveReport(reportId),
    onSuccess: () => {
      toast.success('Report resolved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-report', reportId] })
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resolve report')
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading report</p>
          <Button
            onClick={() => router.push('/admin/reports')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/admin/reports')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
            <p className="mt-1 text-gray-600">Review and manage report</p>
          </div>
        </div>
        {!report.resolved && (
          <Button
            onClick={() => resolveMutation.mutate()}
            disabled={resolveMutation.isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            {resolveMutation.isPending ? 'Resolving...' : 'Resolve Report'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Report ID
              </label>
              <p className="mt-1 text-gray-900">#{report.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Resource Type
              </label>
              <div className="mt-2">
                <Badge variant="outline">{report.resourceType}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Resource ID
              </label>
              <p className="mt-1 text-gray-900">#{report.resourceId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Reporter ID
              </label>
              <p className="mt-1 text-gray-900">#{report.reporterId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-2">
                <Badge variant={report.resolved ? 'default' : 'destructive'}>
                  {report.resolved ? 'Resolved' : 'Unresolved'}
                </Badge>
              </div>
            </div>
            {report.resolvedBy && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Resolved By
                </label>
                <p className="mt-1 text-gray-900">{report.resolvedBy}</p>
              </div>
            )}
            {report.createdAt && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Reason
              </label>
              <p className="mt-1 text-gray-900">{report.reason}</p>
            </div>
            {report.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {report.description}
                </p>
              </div>
            )}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (report.resourceType === 'JOB') {
                    router.push(`/admin/jobs/${report.resourceId}`)
                  } else if (report.resourceType === 'COMPANY') {
                    router.push(`/admin/companies/${report.resourceId}`)
                  } else if (report.resourceType === 'USER') {
                    router.push(`/admin/users/${report.resourceId}`)
                  }
                }}
              >
                View {report.resourceType}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
