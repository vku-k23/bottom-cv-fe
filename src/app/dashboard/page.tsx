'use client'

import { EmployerDashboard } from '@/components/ui'
import { CandidateDashboard } from '@/components/dashboard/CandidateDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Mock data for employer dashboard
  const employerStats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    newApplications: 23,
    views: 1240,
    interviews: 5,
  }

  const recentApplications = [
    {
      id: '1',
      candidateName: 'John Doe',
      jobTitle: 'Senior React Developer',
      appliedAt: '2 hours ago',
      status: 'pending' as const,
      experience: '5 years',
    },
    {
      id: '2',
      candidateName: 'Jane Smith',
      jobTitle: 'Full Stack Developer',
      appliedAt: '1 day ago',
      status: 'shortlisted' as const,
      experience: '3 years',
    },
    {
      id: '3',
      candidateName: 'Mike Johnson',
      jobTitle: 'Frontend Developer',
      appliedAt: '2 days ago',
      status: 'interview' as const,
      experience: '4 years',
    },
  ]

  const recentJobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      applications: 45,
      views: 120,
      postedAt: '2024-01-15',
      status: 'active' as const,
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      applications: 32,
      views: 89,
      postedAt: '2024-01-10',
      status: 'active' as const,
    },
    {
      id: '3',
      title: 'Frontend Developer',
      applications: 28,
      views: 76,
      postedAt: '2024-01-05',
      status: 'paused' as const,
    },
  ]

  const handleViewApplication = (id: string) => {
    console.log('View application:', id)
  }

  const handleViewJob = (id: string) => {
    console.log('View job:', id)
  }

  const handleCreateJob = () => {
    console.log('Create new job')
  }

  const handleEditJob = (id: string) => {
    console.log('Edit job:', id)
  }

  const handleDeleteJob = (id: string) => {
    console.log('Delete job:', id)
  }

  // Debug: Log user data to see what we're getting
  console.log('Dashboard - User data:', user)
  console.log('Dashboard - User roles:', user?.roles)

  // Determine user type based on roles
  const isEmployer = user?.roles?.some((role) => role.name === 'EMPLOYER')
  const isCandidate = user?.roles?.some((role) => role.name === 'CANDIDATE')
  const isAdmin = user?.roles?.some((role) => role.name === 'ADMIN')

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.push('/admin')
    }
  }, [isLoading, isAdmin, router])

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isEmployer && (
        <EmployerDashboard
          stats={employerStats}
          recentApplications={recentApplications}
          recentJobs={recentJobs}
          onViewApplication={handleViewApplication}
          onViewJob={handleViewJob}
          onCreateJob={handleCreateJob}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
        />
      )}

      {isCandidate && <CandidateDashboard />}

      {!isEmployer && !isCandidate && !isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to MyJob Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Please complete your profile setup to access your personalized
              dashboard.
            </p>
            <div className="flex space-x-4">
              <Button>Complete Profile</Button>
              <Button variant="outline">Browse Jobs</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
