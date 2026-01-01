'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ApplicationCard } from './ApplicationCard'
import { ApplyResponse } from '@/lib/applicationService'

interface DraggableApplicationCardProps {
  application: ApplyResponse
  userInfo?: {
    firstName?: string
    lastName?: string
    avatar?: string
    experience?: string
    education?: string
  }
  onDownloadCV?: (applicationId: number) => void
  isDragging?: boolean
}

export function DraggableApplicationCard({
  application,
  userInfo,
  onDownloadCV,
  isDragging: externalIsDragging,
}: DraggableApplicationCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    disabled: externalIsDragging,
  })

  const isCurrentlyDragging = isDragging || externalIsDragging

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isCurrentlyDragging ? 'none' : transition || undefined,
    opacity: isCurrentlyDragging ? 0.4 : 1,
    scale: isCurrentlyDragging ? 0.95 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab transition-all duration-200 active:cursor-grabbing ${
        isCurrentlyDragging ? 'z-50' : ''
      }`}
    >
      <ApplicationCard
        application={application}
        userInfo={userInfo}
        onDownloadCV={onDownloadCV}
      />
    </div>
  )
}
