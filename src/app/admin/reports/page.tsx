'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService } from '@/lib/reportService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flag, Eye, Check } from 'lucide-react'
import { useState } from 'react'
import { FilterBar, FilterConfig } from '@/components/admin/shared/FilterBar'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ReportsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [resolved, setResolved] = useState<boolean | undefined>(undefined)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-reports', page, pageSize, resolved],
    queryFn: () =>
      reportService.getAllReports({
        pageNo: page,
        pageSize,
        resolved,
      }),
  })

  const resolveMutation = useMutation({
    mutationFn: (id: number) => reportService.resolveReport(id),
    onSuccess: () => {
      toast.success('Report resolved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resolve report')
    },
  })

  const reports = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalElements = data?.totalElements || 0

  const filters: Record<string, FilterConfig> = {
    resolved: {
      type: 'select',
      placeholder: 'All Status',
      value: resolved === undefined ? '' : resolved.toString(),
      onChange: (value) => {
        if (value === '') setResolved(undefined)
        else setResolved(value === 'true')
        setPage(0)
      },
      options: [
        { label: 'All Status', value: '' },
        { label: 'Unresolved', value: 'false' },
        { label: 'Resolved', value: 'true' },
      ],
    },
  }

  const handleReset = () => {
    setResolved(undefined)
    setPage(0)
  }

  const handleResolve = (reportId: number) => {
    resolveMutation.mutate(reportId)
  }

  const unresolvedCount = reports.filter((r) => !r.resolved).length
  const resolvedCount = reports.filter((r) => r.resolved).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Report Management</h1>
        <p className="mt-1 text-gray-600">
          Review and resolve user-submitted reports
        </p>
      </div>

      <FilterBar filters={filters} onReset={handleReset} />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {unresolvedCount}
              </p>
              <p className="text-sm text-gray-600">Unresolved Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {resolvedCount}
              </p>
              <p className="text-sm text-gray-600">Resolved Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalElements}</p>
              <p className="text-sm text-gray-600">Total Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reports ({totalElements})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-red-500">Error loading reports</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">No reports found</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Flag className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {report.resourceType} #{report.resourceId}
                            </CardTitle>
                            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                              <span>Reporter ID: {report.reporterId}</span>
                              {report.createdAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {new Date(
                                      report.createdAt
                                    ).toLocaleString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{report.resourceType}</Badge>
                          <Badge
                            variant={
                              report.resolved ? 'default' : 'destructive'
                            }
                          >
                            {report.resolved ? 'Resolved' : 'Unresolved'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-sm font-medium text-gray-900">
                        Reason:
                      </p>
                      <p className="mb-4 text-sm text-gray-700">
                        {report.reason}
                      </p>
                      {report.description && (
                        <>
                          <p className="mb-2 text-sm font-medium text-gray-900">
                            Description:
                          </p>
                          <p className="mb-4 text-sm text-gray-700">
                            {report.description}
                          </p>
                        </>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (report.resourceType === 'JOB') {
                              router.push(`/admin/jobs/${report.resourceId}`)
                            } else if (report.resourceType === 'COMPANY') {
                              router.push(
                                `/admin/companies/${report.resourceId}`
                              )
                            }
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View Resource
                        </Button>
                        {!report.resolved && (
                          <Button
                            size="sm"
                            onClick={() => handleResolve(report.id)}
                            disabled={resolveMutation.isPending}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {page * pageSize + 1} to{' '}
                  {Math.min((page + 1) * pageSize, totalElements)} of{' '}
                  {totalElements} reports
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                  >
                    Next
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
