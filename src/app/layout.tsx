import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobPortal - Find Your Dream Job',
  description:
    'Connect with top employers and find your next career opportunity. Browse thousands of jobs from leading companies.',
  keywords: 'jobs, careers, employment, hiring, recruitment, job search',
  authors: [{ name: 'JobPortal Team' }],
  openGraph: {
    title: 'JobPortal - Find Your Dream Job',
    description:
      'Connect with top employers and find your next career opportunity.',
    url: 'https://jobportal.com',
    siteName: 'JobPortal',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JobPortal - Find Your Dream Job',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobPortal - Find Your Dream Job',
    description:
      'Connect with top employers and find your next career opportunity.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
