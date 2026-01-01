'use client'

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { KanbanColumn, KanbanColumnData } from './KanbanColumn'
import { ApplicationCard } from './ApplicationCard'
import { Button } from '@/components/ui/button'

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  onMoveApplication: (
    applicationId: number,
    fromStatus: string,
    toStatus: string,
    position?: number
  ) => Promise<void>
  onCreateColumn?: () => void
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
  jobTitle?: string
}

export function KanbanBoard({
  columns,
  onMoveApplication,
  onCreateColumn,
  onEditColumn,
  onDeleteColumn,
  onDownloadCV,
  getUserInfo,
  jobTitle,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [overId, setOverId] = useState<string | number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over?.id ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const applicationId = active.id as number
    const targetId = over.id

    // Check if dropped on a column (string ID) or another card (number ID)
    const targetColumn = columns.find((col) => col.id === targetId)
    const targetCard = columns
      .flatMap((col) => col.applications)
      .find((app) => app.id === targetId)

    // Find source column
    const sourceColumn = columns.find((col) =>
      col.applications.some((app) => app.id === applicationId)
    )

    if (!sourceColumn) return

    // Determine target column and position
    let finalTargetColumn = targetColumn
    let targetPosition: number | undefined

    if (targetCard && !targetColumn) {
      // Dropped on a card - find its column and position
      finalTargetColumn = columns.find((col) =>
        col.applications.some((app) => app.id === targetId)
      )
      if (finalTargetColumn) {
        const cardIndex = finalTargetColumn.applications.findIndex(
          (app) => app.id === targetId
        )
        targetPosition = cardIndex >= 0 ? cardIndex : undefined
      }
    } else if (targetColumn) {
      // Dropped on column - add to end
      targetPosition = targetColumn.applications.length
    }

    if (!finalTargetColumn) return

    // Skip if moving to "all" column
    if (finalTargetColumn.id === 'all') {
      return
    }

    // If moving within same column, calculate position based on drop location
    if (sourceColumn.id === finalTargetColumn.id && targetCard) {
      const cardIndex = finalTargetColumn.applications.findIndex(
        (app) => app.id === targetId
      )
      const currentIndex = finalTargetColumn.applications.findIndex(
        (app) => app.id === applicationId
      )
      // If dropping below the card, insert after it
      targetPosition = cardIndex >= 0 ? cardIndex + 1 : undefined
      // Adjust if moving from above
      if (currentIndex >= 0 && currentIndex < cardIndex) {
        targetPosition = cardIndex
      }
    }

    // Move application
    try {
      await onMoveApplication(
        applicationId,
        sourceColumn.status,
        finalTargetColumn.status,
        targetPosition
      )
    } catch (error) {
      console.error('Failed to move application:', error)
      // Error handling will be done by the parent component
    }
  }

  const activeApplication = activeId
    ? columns
        .flatMap((col) => col.applications)
        .find((app) => app.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} data-column-id={column.id}>
            <SortableContext
              id={column.id}
              items={column.applications.map((app) => app.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                column={column}
                onEditColumn={onEditColumn}
                onDeleteColumn={onDeleteColumn}
                onDownloadCV={onDownloadCV}
                getUserInfo={getUserInfo}
                activeId={activeId}
                overId={overId}
                jobTitle={jobTitle}
              />
            </SortableContext>
          </div>
        ))}

        {/* Create New Column Button */}
        {onCreateColumn && (
          <div className="flex h-[790px] w-[312px] shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
            <Button
              variant="ghost"
              onClick={onCreateColumn}
              className="flex flex-col items-center gap-2"
            >
              <Plus className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Create New Column
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeApplication && (
          <div className="w-[280px] rotate-2 opacity-95 shadow-xl">
            <ApplicationCard
              application={activeApplication}
              userInfo={getUserInfo?.(activeApplication.userId)}
              jobTitle={jobTitle}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
