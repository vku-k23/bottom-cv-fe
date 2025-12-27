'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Progress,
  Alert,
  AlertDescription,
  JobCard,
  SearchFilter,
  ApplicationStatus,
  ApplicationStatusTimeline,
} from '@/components/ui'

export default function ComponentsDemoPage() {
  const [_searchFilters, setSearchFilters] = useState<{
    query?: string
    location?: string
    category?: string
  }>({})
  const [progress, setProgress] = useState(65)

  const handleSearch = (filters: {
    query?: string
    location?: string
    category?: string
  }) => {
    setSearchFilters(filters)
    console.log('Search filters:', filters)
  }

  const handleClear = () => {
    setSearchFilters({})
    console.log('Cleared filters')
  }

  const mockJob = {
    id: '1',
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'full-time' as const,
    postedAt: '2 days ago',
    description:
      'We are looking for a senior React developer to join our team and help build amazing user experiences.',
    tags: ['React', 'TypeScript', 'Node.js', 'AWS'],
    onApply: (id: string) => console.log('Apply to job:', id),
    onViewDetails: (id: string) => console.log('View job details:', id),
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Components Demo</h1>
          <p className="mt-2 text-gray-600">
            Showcase of all available UI components
          </p>
        </div>

        <div className="space-y-8">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button size="sm">Small Button</Button>
                <Button size="lg">Large Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Input Field
                  </label>
                  <Input placeholder="Enter text..." />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Select
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Textarea
                </label>
                <Textarea placeholder="Enter description..." />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="demo-checkbox" />
                <label htmlFor="demo-checkbox" className="text-sm">
                  Checkbox option
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Progress Bar
                </label>
                <Progress value={progress} className="mb-2" />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    -
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  This is a default alert message.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Job Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Card Component</CardTitle>
            </CardHeader>
            <CardContent>
              <JobCard {...mockJob} />
            </CardContent>
          </Card>

          {/* Search Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Search Filter Component</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter onSearch={handleSearch} onClear={handleClear} />
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Status Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <ApplicationStatus status="pending" />
                  <ApplicationStatus status="reviewed" />
                  <ApplicationStatus status="shortlisted" />
                  <ApplicationStatus status="interview" />
                  <ApplicationStatus status="accepted" />
                  <ApplicationStatus status="rejected" />
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Status Timeline</h4>
                <ApplicationStatusTimeline status="interview" />
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Card Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      This is a simple card component.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card with Badge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Content here</p>
                      <Badge>New</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card with Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Progress: {progress}%
                      </p>
                      <Progress value={progress} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
