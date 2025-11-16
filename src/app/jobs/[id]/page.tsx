'use client'

import { JobDetailPage } from '@/components/jobs/JobDetailPage'
import { use } from 'react'

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <JobDetailPage jobId={id} />
}

