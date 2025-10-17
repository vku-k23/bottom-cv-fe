'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CVCard } from './CVCard'
import { CVForm } from './CVForm'
import { CVResponse, CVRequest } from '@/types/cv'
import { cvService } from '@/lib/cvService'
import { Plus, Search, Grid, List, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CVListProps {
  cvs: CVResponse[]
  onRefresh: () => void
}

export function CVList({ cvs, onRefresh }: CVListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCV, setEditingCV] = useState<CVResponse | null>(null)
  const [viewingCV, setViewingCV] = useState<CVResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleCreateCV = () => {
    setEditingCV(null)
    setShowForm(true)
  }

  const handleEditCV = (cv: CVResponse) => {
    setEditingCV(cv)
    setShowForm(true)
  }

  const handleViewCV = (cv: CVResponse) => {
    setViewingCV(cv)
  }

  const handleDeleteCV = async (id: number) => {
    try {
      await cvService.deleteCV(id)
      onRefresh()
    } catch (_error) {
      toast.error('Failed to delete CV')
    }
  }

  const handleFormSubmit = async (data: CVRequest) => {
    setIsLoading(true)
    try {
      if (editingCV) {
        await cvService.updateCV(editingCV.id, data)
      } else {
        await cvService.createCV(data)
      }
      setShowForm(false)
      setEditingCV(null)
      onRefresh()
    } catch (_error) {
      toast.error(editingCV ? 'Failed to update CV' : 'Failed to create CV')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCV(null)
  }

  const filteredCVs = cvs.filter(
    (cv) =>
      cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cv.experience?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingCV ? 'Edit CV' : 'Create New CV'}
          </h2>
          <Button variant="outline" onClick={handleFormCancel}>
            Back to CVs
          </Button>
        </div>
        <CVForm
          cv={editingCV || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      </div>
    )
  }

  if (viewingCV) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">CV Details</h2>
          <Button variant="outline" onClick={() => setViewingCV(null)}>
            Back to CVs
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{viewingCV.title}</span>
            </CardTitle>
            <CardDescription>
              Created {new Date(viewingCV.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {viewingCV.skills && (
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Skills</h4>
                <p className="text-gray-700">{viewingCV.skills}</p>
              </div>
            )}
            {viewingCV.experience && (
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Experience</h4>
                <p className="text-gray-700">{viewingCV.experience}</p>
              </div>
            )}
            {viewingCV.content && (
              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Additional Content
                </h4>
                <p className="text-gray-700">{viewingCV.content}</p>
              </div>
            )}
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  setViewingCV(null)
                  handleEditCV(viewingCV)
                }}
              >
                Edit CV
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const blob = await cvService.downloadCV(viewingCV.cvFile)
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${viewingCV.title}.pdf`
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                    toast.success('CV downloaded successfully')
                  } catch (_error) {
                    toast.error('Failed to download CV')
                  }
                }}
              >
                Download CV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My CVs</h2>
          <p className="text-gray-600">Manage your professional CVs</p>
        </div>
        <Button
          onClick={handleCreateCV}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create CV</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search CVs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CV List */}
      {filteredCVs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {searchTerm ? 'No CVs found' : 'No CVs yet'}
            </h3>
            <p className="mb-6 text-center text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first CV to get started'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateCV}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First CV
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          }
        >
          {filteredCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              onEdit={handleEditCV}
              onDelete={handleDeleteCV}
              onView={handleViewCV}
            />
          ))}
        </div>
      )}
    </div>
  )
}
