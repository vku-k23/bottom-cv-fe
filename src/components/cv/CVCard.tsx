'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CVResponse } from '@/types/cv'
import { cvService } from '@/lib/cvService'
import { toast } from 'react-hot-toast'

interface CVCardProps {
  cv: CVResponse
  onEdit: (cv: CVResponse) => void
  onDelete: (id: number) => void
  onView: (cv: CVResponse) => void
}

export function CVCard({ cv, onEdit, onDelete, onView }: CVCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDownload = async () => {
    try {
      const blob = await cvService.downloadCV(cv.cvFile)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.title}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('CV downloaded successfully')
    } catch (_error) {
      toast.error('Failed to download CV')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      setIsDeleting(true)
      try {
        await cvService.deleteCV(cv.id)
        onDelete(cv.id)
        toast.success('CV deleted successfully')
      } catch (_error) {
        toast.error('Failed to delete CV')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {cv.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Created {formatDate(cv.createdAt)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={cv.status === 'ACTIVE' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {cv.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(cv)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(cv)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {cv.skills && (
            <div>
              <div className="mb-1 flex items-center text-sm text-gray-600">
                <User className="mr-1 h-4 w-4" />
                Skills
              </div>
              <p className="line-clamp-2 text-sm text-gray-800">{cv.skills}</p>
            </div>
          )}

          {cv.experience && (
            <div>
              <div className="mb-1 flex items-center text-sm text-gray-600">
                <Calendar className="mr-1 h-4 w-4" />
                Experience
              </div>
              <p className="line-clamp-2 text-sm text-gray-800">
                {cv.experience}
              </p>
            </div>
          )}

          {cv.content && (
            <div>
              <p className="line-clamp-3 text-sm text-gray-800">{cv.content}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Updated {formatDate(cv.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
