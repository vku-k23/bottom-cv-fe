'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  title: string
}

export function Breadcrumb({ items, title }: BreadcrumbProps) {
  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <h1
        className="text-2xl font-medium text-gray-900"
        suppressHydrationWarning
      >
        {title}
      </h1>
      <div className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 transition-colors hover:text-gray-900"
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-normal text-gray-900"
                suppressHydrationWarning
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
