'use client'

import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export function ProfileCompletionAlert() {
  const { user } = useAuthStore()
  const { t } = useTranslation()

  // Check if profile is incomplete
  const isProfileIncomplete =
    !user?.profile?.firstName ||
    !user?.profile?.lastName ||
    !user?.profile?.phoneNumber

  if (!isProfileIncomplete) {
    return null
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800">
            {t('Dashboard.profileIncomplete')}
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {t('Dashboard.completeProfile')}
          </p>
          <div className="mt-4">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-red-800 shadow-sm hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            >
              {t('Dashboard.editProfile')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
