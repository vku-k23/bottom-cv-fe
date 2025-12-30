'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/adminService'
import { companyService } from '@/lib/companyService'
import { jobService } from '@/lib/jobService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminStatsCard } from '@/components/admin/shared/AdminStatsCard'
import {
  Users,
  Building,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { EmployerDashboard } from '@/components/employer/EmployerDashboard'

export default function AdminDashboard() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  // Check if user is EMPLOYER (not ADMIN)
  const isEmployer = user?.roles?.some((role) => {
    const roleName =
      typeof role.name === 'string'
        ? role.name.toUpperCase()
        : String(role.name).toUpperCase()
    return (
      roleName === 'EMPLOYER' &&
      !user?.roles?.some((r) => {
        const rName =
          typeof r.name === 'string'
            ? r.name.toUpperCase()
            : String(r.name).toUpperCase()
        return rName === 'ADMIN'
      })
    )
  })

  // Fetch real data from backend - hooks must be called at top level
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
    enabled: !isEmployer, // Only fetch if not employer
  })

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: () => adminService.getActivities(),
    enabled: !isEmployer, // Only fetch if not employer
  })

  const { data: userGrowthData } = useQuery({
    queryKey: ['user-growth-chart'],
    queryFn: () => adminService.getUserGrowthChart(30),
    enabled: !isEmployer, // Only fetch if not employer
  })

  const { data: jobTrendData } = useQuery({
    queryKey: ['job-trend-chart'],
    queryFn: () => adminService.getJobTrendChart(30),
    enabled: !isEmployer, // Only fetch if not employer
  })

  // Fetch recent companies and jobs
  const { data: recentCompanies } = useQuery({
    queryKey: ['recent-companies'],
    queryFn: () =>
      companyService.getAllCompanies({
        pageNo: 0,
        pageSize: 5,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
    enabled: !isEmployer, // Only fetch if not employer
  })

  const { data: recentJobs } = useQuery({
    queryKey: ['recent-jobs'],
    queryFn: () =>
      jobService.getAllJobs({
        pageNo: 0,
        pageSize: 5,
        sortBy: 'createdAt',
        sortType: 'desc',
      }),
    enabled: !isEmployer, // Only fetch if not employer
  })

  // Show employer dashboard if user is employer
  if (isEmployer) {
    return <EmployerDashboard />
  }

  if (statsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">{t('Admin.dashboard.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('Admin.dashboard.title')}
        </h1>
        <p className="mt-1 text-gray-600">{t('Admin.dashboard.welcome')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title={t('Admin.dashboard.totalUsers')}
          value={stats?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          color="blue"
          description={`${stats?.newUsersThisMonth || 0} ${t('Admin.dashboard.newThisMonth')}`}
          trend={{
            value: stats?.userGrowthRate || 0,
            label: t('Admin.dashboard.fromLastMonth'),
            positive: (stats?.userGrowthRate || 0) >= 0,
          }}
        />
        <AdminStatsCard
          title={t('Admin.dashboard.companies')}
          value={stats?.totalCompanies.toLocaleString() || '0'}
          icon={Building}
          color="green"
          description={`${stats?.totalEmployers || 0} ${t('Admin.dashboard.employers')}`}
        />
        <AdminStatsCard
          title={t('Admin.dashboard.activeJobs')}
          value={stats?.activeJobs.toLocaleString() || '0'}
          icon={Briefcase}
          color="purple"
          description={`${stats?.pendingJobs || 0} ${t('Admin.dashboard.pendingApproval')}`}
          trend={{
            value: stats?.jobGrowthRate || 0,
            label: t('Admin.dashboard.fromLastMonth'),
            positive: (stats?.jobGrowthRate || 0) >= 0,
          }}
        />
        <AdminStatsCard
          title={t('Admin.dashboard.applications')}
          value={stats?.totalApplications.toLocaleString() || '0'}
          icon={FileText}
          color="yellow"
          trend={{
            value: stats?.applicationGrowthRate || 0,
            label: t('Admin.dashboard.fromLastMonth'),
            positive: (stats?.applicationGrowthRate || 0) >= 0,
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.dashboard.userGrowth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Job Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Admin.dashboard.jobPostingsTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={jobTrendData?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('Admin.dashboard.recentActivities')}</CardTitle>
            <Button variant="ghost" size="sm">
              {t('Admin.dashboard.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-gray-500">
                {t('Admin.dashboard.loadingActivities')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities?.slice(0, 5).map((activity, index) => (
                <div
                  key={activity.id || `activity-${index}-${activity.timestamp}`}
                  className="flex items-start space-x-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-100'
                        : activity.status === 'warning'
                          ? 'bg-yellow-100'
                          : activity.status === 'error'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                    }`}
                  >
                    {activity.status === 'success' ? (
                      <CheckCircle
                        className={`h-4 w-4 ${
                          activity.status === 'success'
                            ? 'text-green-600'
                            : activity.status === 'warning'
                              ? 'text-yellow-600'
                              : activity.status === 'error'
                                ? 'text-red-600'
                                : 'text-blue-600'
                        }`}
                      />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Companies and Jobs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('Admin.dashboard.recentCompanies')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/companies')}
              >
                {t('Admin.dashboard.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentCompanies?.data && recentCompanies.data.length > 0 ? (
              <div className="space-y-3">
                {recentCompanies.data.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
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
                        <p className="font-medium text-gray-900">
                          {company.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        company.verified === true ||
                        (typeof company.verified === 'number' &&
                          company.verified === 1)
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {company.verified === true ||
                      (typeof company.verified === 'number' &&
                        company.verified === 1)
                        ? t('Admin.dashboard.verified')
                        : t('Admin.dashboard.pending')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {t('Admin.dashboard.noCompaniesYet')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('Admin.dashboard.recentJobs')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/jobs')}
              >
                {t('Admin.dashboard.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentJobs?.data && recentJobs.data.length > 0 ? (
              <div className="space-y-3">
                {recentJobs.data.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {job.company?.name || 'Unknown'} •{' '}
                        {job.location || 'N/A'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        (typeof job.status === 'string'
                          ? job.status
                          : (
                              job.status as {
                                displayName?: string
                                name?: string
                              }
                            )?.displayName ||
                            (
                              job.status as {
                                displayName?: string
                                name?: string
                              }
                            )?.name ||
                            '') === 'ACTIVE'
                          ? 'default'
                          : (typeof job.status === 'string'
                                ? job.status
                                : (
                                    job.status as {
                                      displayName?: string
                                      name?: string
                                    }
                                  )?.displayName ||
                                  (
                                    job.status as {
                                      displayName?: string
                                      name?: string
                                    }
                                  )?.name ||
                                  '') === 'PENDING'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {typeof job.status === 'string'
                        ? job.status
                        : (
                            job.status as {
                              displayName?: string
                              name?: string
                            }
                          )?.displayName ||
                          (
                            job.status as {
                              displayName?: string
                              name?: string
                            }
                          )?.name ||
                          'N/A'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {t('Admin.dashboard.noJobsYet')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('Admin.dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/admin/users')}
            >
              <Users className="mb-2 h-6 w-6" />
              <span>{t('Admin.dashboard.manageUsers')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/admin/moderation')}
            >
              <Briefcase className="mb-2 h-6 w-6" />
              <span>{t('Admin.dashboard.jobModerationAction')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/admin/companies')}
            >
              <Building className="mb-2 h-6 w-6" />
              <span>{t('Admin.dashboard.companies')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.push('/admin/reports')}
            >
              <AlertCircle className="mb-2 h-6 w-6" />
              <span>{t('Admin.sidebar.reports')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
