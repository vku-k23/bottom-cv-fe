'use client'

import { ApplicationsKanbanPage } from '@/components/applications'
import { useSearchParams } from 'next/navigation'

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')
    ? Number(searchParams.get('jobId'))
    : undefined
  const jobTitle = searchParams.get('jobTitle') || undefined

  return <ApplicationsKanbanPage jobId={jobId} jobTitle={jobTitle} />
}
