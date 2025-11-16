'use client'

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
        <div className="text-center text-xs text-gray-600 sm:text-left sm:text-sm">
          <p>© {currentYear} BottomCV Admin Dashboard. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-600 sm:space-x-4 sm:text-sm">
          <span>Version 1.0.0</span>
          <span className="hidden sm:inline">•</span>
          <a
            href="/admin/settings"
            className="transition-colors hover:text-gray-900"
          >
            System Settings
          </a>
        </div>
      </div>
    </footer>
  )
}
