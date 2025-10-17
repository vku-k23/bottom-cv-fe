'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building,
  Briefcase,
  FileText,
  // TrendingUp,
  // UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    totalCompanies: 89,
    totalJobs: 456,
    totalApplications: 2341,
    activeUsers: 892,
    pendingApprovals: 23,
    systemHealth: 98.5,
    revenue: 45600,
  }

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: John Doe',
      timestamp: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'job_posted',
      message: 'New job posted: Senior React Developer',
      timestamp: '15 minutes ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'company_verification',
      message: 'Company verification pending: TechCorp Inc.',
      timestamp: '1 hour ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'application_submitted',
      message: 'New application submitted for Frontend Developer',
      timestamp: '2 hours ago',
      status: 'success',
    },
  ]

  const topCompanies = [
    { name: 'TechCorp Inc.', jobs: 23, applications: 156 },
    { name: 'StartupXYZ', jobs: 18, applications: 89 },
    { name: 'Innovation Labs', jobs: 15, applications: 67 },
    { name: 'Design Co', jobs: 12, applications: 45 },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High server load detected',
      timestamp: '30 minutes ago',
    },
    {
      id: 2,
      type: 'info',
      message: 'Database backup completed',
      timestamp: '2 hours ago',
    },
    {
      id: 3,
      type: 'success',
      message: 'System update deployed successfully',
      timestamp: '4 hours ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          System overview and management tools
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-muted-foreground text-xs">+5 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-muted-foreground text-xs">
              {stats.pendingApprovals} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalApplications.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-100'
                        : activity.status === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                    }`}
                  >
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
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
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      alert.type === 'success'
                        ? 'bg-green-100'
                        : alert.type === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                    }`}
                  >
                    {alert.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : alert.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Top Companies by Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-sm text-gray-500">
                      {company.jobs} jobs • {company.applications} applications
                    </p>
                  </div>
                </div>
                <Badge variant="outline">#{index + 1}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="mb-2 h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Building className="mb-2 h-6 w-6" />
              <span>Manage Companies</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="mb-2 h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
