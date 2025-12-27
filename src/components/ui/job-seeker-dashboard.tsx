'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Briefcase,
  FileText,
  TrendingUp,
  Eye,
  Calendar,
  Star,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { ApplicationStatus } from './application-status'

interface JobSeekerStats {
  applicationsSent: number
  interviewsScheduled: number
  profileViews: number
  profileCompleteness: number
}

interface RecentApplication {
  id: string
  jobTitle: string
  company: string
  appliedAt: string
  status:
    | 'pending'
    | 'reviewed'
    | 'shortlisted'
    | 'interview'
    | 'rejected'
    | 'accepted'
  location: string
  salary?: string
}

interface RecommendedJob {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  postedAt: string
  matchScore: number
  tags: string[]
}

interface JobSeekerDashboardProps {
  stats: JobSeekerStats
  recentApplications: RecentApplication[]
  recommendedJobs: RecommendedJob[]
  onViewApplication: (id: string) => void
  onApplyJob: (id: string) => void
  onViewJob: (id: string) => void
  onCompleteProfile: () => void
}

export function JobSeekerDashboard({
  stats,
  recentApplications,
  recommendedJobs,
  onViewApplication,
  onApplyJob,
  onViewJob,
  onCompleteProfile,
}: JobSeekerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Applications Sent
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsSent}</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.interviewsScheduled}
            </div>
            <p className="text-muted-foreground text-xs">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Complete
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.profileCompleteness}%
            </div>
            <Progress value={stats.profileCompleteness} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion Alert */}
      {stats.profileCompleteness < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">
                  Complete your profile to get more job matches
                </p>
                <p className="text-sm text-orange-700">
                  You&apos;re {100 - stats.profileCompleteness}% away from a
                  complete profile
                </p>
              </div>
              <Button onClick={onCompleteProfile} size="sm">
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <p className="font-medium">{application.jobTitle}</p>
                    <p className="text-sm text-gray-600">
                      {application.company}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {application.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {application.appliedAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <ApplicationStatus status={application.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplication(application.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {job.postedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {job.type.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center text-xs text-green-600">
                        <Star className="mr-1 h-3 w-3" />
                        {job.matchScore}% match
                      </div>
                    </div>
                  </div>

                  {job.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {job.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewJob(job.id)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onApplyJob(job.id)}
                      className="flex-1"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Briefcase className="mb-2 h-6 w-6" />
              <span>Browse Jobs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="mb-2 h-6 w-6" />
              <span>Update Resume</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="mb-2 h-6 w-6" />
              <span>Profile Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="mb-2 h-6 w-6" />
              <span>My Applications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
