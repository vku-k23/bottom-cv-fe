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
  columnId?: number // Backend column ID for delete operations
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
  activeId?: number | null
  overId?: string | number | null
}

export function KanbanColumn({
  column,
  onEditColumn,
  onDeleteColumn,
  onDownloadCV,
  getUserInfo,
  activeId,
  overId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const isColumnOver = isOver && overId === column.id
  const isCardOver = overId && typeof overId === 'number' && column.applications.some(app => app.id === overId)

  return (
    <div
      ref={setNodeRef}
      className={`flex h-[790px] w-[312px] flex-col rounded-lg border border-gray-100 bg-gray-50/50 transition-all duration-200 ${
        isColumnOver ? 'border-blue-400 bg-blue-50/80 shadow-md' : ''
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
        {column.applications.map((application, index) => {
          const isOverCard = overId === application.id && activeId !== application.id
          const showDropIndicator = isOverCard || (isColumnOver && index === 0 && column.applications.length === 0)
          
          return (
            <div key={application.id} className="relative">
              {/* Drop Indicator - Jira style */}
              {showDropIndicator && (
                <div className="absolute -top-2 left-0 right-0 z-10 h-0.5 bg-blue-500 rounded-full animate-pulse" />
              )}
              <DraggableApplicationCard
                application={application}
                userInfo={getUserInfo?.(application.userId)}
                onDownloadCV={onDownloadCV}
                isDragging={activeId === application.id}
              />
              {/* Drop Indicator after card */}
              {isOverCard && (
                <div className="absolute -bottom-2 left-0 right-0 z-10 h-0.5 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
          )
        })}
        {/* Drop indicator at the end of column */}
        {isColumnOver && column.applications.length > 0 && !isCardOver && (
          <div className="h-0.5 bg-blue-500 rounded-full animate-pulse" />
        )}
        {column.applications.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            {isColumnOver ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-0.5 w-full max-w-[200px] bg-blue-500 rounded-full animate-pulse" />
                <span>Drop here</span>
              </div>
            ) : (
              'No applications'
            )}
          </div>
        )}
      </div>
    </div>
  )
}
