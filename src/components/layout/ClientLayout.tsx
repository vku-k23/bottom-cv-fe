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
  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')

  // Initialize authentication on app start
  useInitializeAuth()

  // Admin pages have their own layout - don't wrap with Navbar/Footer
  if (isAdminPage) {
    return (
      <>
        {children}
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
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 bg-white pt-16 lg:pt-24`}>
        {isAuthPage ? (
          children
        ) : (
          <div className="mx-auto max-w-7xl">{children}</div>
        )}
      </main>
      {!isAuthPage && <Footer />}
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
