'use client'

import Link from 'next/link'
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

interface Application {
  id: string
  jobTitle: string
  company: string
  location: string
  salary: string
  appliedDate: string
  status: 'active' | 'pending' | 'rejected'
  type: string
}

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Networking Engineer',
    company: 'Upwork',
    location: 'Washington',
    salary: '$50k-80k/month',
    appliedDate: 'Feb 2, 2019 19:28',
    status: 'active',
    type: 'Remote',
  },
  {
    id: '2',
    jobTitle: 'Product Designer',
    company: 'Dribbble',
    location: 'Dhaka',
    salary: '$50k-80k/month',
    appliedDate: 'Dec 7, 2019 23:26',
    status: 'active',
    type: 'Full Time',
  },
  {
    id: '3',
    jobTitle: 'Junior Graphic Designer',
    company: 'Apple',
    location: 'Brazil',
    salary: '$50k-80k/month',
    appliedDate: 'Feb 2, 2019 19:28',
    status: 'active',
    type: 'Temporary',
  },
  {
    id: '4',
    jobTitle: 'Visual Designer',
    company: 'Microsoft',
    location: 'Wisconsin',
    salary: '$50k-80k/month',
    appliedDate: 'Dec 7, 2019 23:26',
    status: 'active',
    type: 'Contract Base',
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active'
    case 'pending':
      return 'Pending'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Unknown'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600'
    case 'pending':
      return 'text-yellow-600'
    case 'rejected':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function RecentApplications() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recently Applied
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
          <div className="col-span-5">Job</div>
          <div className="col-span-2">Date Applied</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Action</div>
        </div>

        {/* Applications */}
        {mockApplications.map((application) => (
          <div
            key={application.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50"
          >
            {/* Job Info */}
            <div className="col-span-5">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      {application.company.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {application.jobTitle}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {application.company}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {application.location}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {application.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {application.salary}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Applied */}
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-gray-600">
                {application.appliedDate}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center space-x-2">
                {getStatusIcon(application.status)}
                <span
                  className={`text-sm font-medium ${getStatusColor(application.status)}`}
                >
                  {getStatusText(application.status)}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="col-span-3 flex items-center">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                <Eye className="mr-1 h-4 w-4" />
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
