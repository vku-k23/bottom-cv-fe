'use client'

import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { useInitializeAuth } from '@/stores/authStore'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideLayout = pathname.startsWith('/auth')

  // Initialize authentication on app start
  useInitializeAuth()

  return (
    <div className="flex min-h-screen flex-col">
      {!hideLayout && <Navbar />}
      <main className={`flex-1 ${!hideLayout ? 'pt-16 lg:pt-[4.5rem]' : ''}`}>
        {children}
      </main>
      {!hideLayout && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  )
}
