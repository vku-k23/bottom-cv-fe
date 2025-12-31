'use client'

import { useDroppable } from '@dnd-kit/core'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DraggableApplicationCard } from './DraggableApplicationCard'
import { ApplyResponse } from '@/lib/applicationService'

export interface KanbanColumnData {
  id: string
  title: string
  status: string
  applications: ApplyResponse[]
  isCustom?: boolean
}

interface KanbanColumnProps {
  column: KanbanColumnData
  onEditColumn?: (columnId: string) => void
  onDeleteColumn?: (columnId: string) => void
  onDownloadCV?: (applicationId: number) => void
  getUserInfo?: (userId: number) =>
    | {
        firstName?: string
        lastName?: string
        avatar?: string
        experience?: string
        education?: string
      }
    | undefined
}

export function KanbanColumn({
  column,
  onEditColumn,
  onDeleteColumn,
  onDownloadCV,
  getUserInfo,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex h-[790px] w-[312px] flex-col rounded-lg border border-gray-100 bg-gray-50/50 transition-colors ${
        isOver ? 'border-blue-300 bg-blue-50' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">
            {column.title} ({column.applications.length})
          </h3>
        </div>

        {/* Dropdown Menu for Custom Columns */}
        {column.isCustom && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEditColumn?.(column.id)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Column</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteColumn?.(column.id)}
                className="flex items-center gap-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Applications List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {column.applications.map((application) => (
          <DraggableApplicationCard
            key={application.id}
            application={application}
            userInfo={getUserInfo?.(application.userId)}
            onDownloadCV={onDownloadCV}
          />
        ))}
        {column.applications.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            No applications
          </div>
        )}
      </div>
    </div>
  )
}
