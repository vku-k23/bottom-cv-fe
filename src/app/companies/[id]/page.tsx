'use client'

import { CompanyDetailPage } from '@/components/companies/CompanyDetailPage'
import { use } from 'react'

export default function CompanyDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <CompanyDetailPage companyId={id} />
}

