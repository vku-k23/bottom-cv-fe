'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (
      (document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark') || 'light'
    )
  })

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (!mounted) {
    return <div className="skeleton h-9 w-9 rounded-md" aria-hidden />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      className={cn(
        'focus-outline border-border bg-bg-subtle inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition',
        theme === 'dark'
          ? 'bg-gray-800 text-gray-200'
          : 'bg-white text-gray-700'
      )}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // sun icon
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M16.66 16.66l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M18.36 5.34l-1.41 1.41" />
        </svg>
      ) : (
        // moon icon
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
