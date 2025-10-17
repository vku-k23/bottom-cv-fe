'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  Briefcase,
  Eye,
  Calendar,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  newApplications: number
  views: number
  interviews: number
}

interface RecentApplication {
  id: string
  candidateName: string
  jobTitle: string
  appliedAt: string
  status:
    | 'pending'
    | 'reviewed'
    | 'shortlisted'
    | 'interview'
    | 'rejected'
    | 'accepted'
  experience: string
}

interface RecentJob {
  id: string
  title: string
  applications: number
  views: number
  postedAt: string
  status: 'active' | 'paused' | 'closed'
}

interface EmployerDashboardProps {
  stats: DashboardStats
  recentApplications: RecentApplication[]
  recentJobs: RecentJob[]
  onViewApplication: (id: string) => void
  onViewJob: (id: string) => void
  onCreateJob: () => void
  onEditJob: (id: string) => void
  onDeleteJob: (id: string) => void
}

export function EmployerDashboard({
  stats,
  recentApplications,
  recentJobs,
  onViewApplication,
  onViewJob,
  onCreateJob,
  onEditJob,
  onDeleteJob,
}: EmployerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-muted-foreground text-xs">
              {stats.activeJobs} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-muted-foreground text-xs">
              +{stats.newApplications} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{application.candidateName}</p>
                    <p className="text-sm text-gray-600">
                      {application.jobTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {application.appliedAt}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{application.experience}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application.id)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Jobs</CardTitle>
            <Button onClick={onCreateJob} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>{job.views}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewJob(job.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditJob(job.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteJob(job.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="mb-2 h-6 w-6" />
              <span>Post New Job</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="mb-2 h-6 w-6" />
              <span>View Candidates</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="mb-2 h-6 w-6" />
              <span>Schedule Interview</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
