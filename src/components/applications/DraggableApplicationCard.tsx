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
}

export function DraggableApplicationCard({
  application,
  userInfo,
  onDownloadCV,
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
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ApplicationCard
        application={application}
        userInfo={userInfo}
        onDownloadCV={onDownloadCV}
      />
    </div>
  )
}
