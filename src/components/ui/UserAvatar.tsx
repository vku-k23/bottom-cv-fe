import React, { useState, useRef, useEffect } from 'react'
import { User } from '@/types/auth'

interface UserAvatarProps {
  user: User
  onLogout: () => void
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials =
    user.profile?.firstName?.[0] + (user.profile?.lastName?.[0] || '') ||
    user.username[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 hover:ring-2 hover:ring-blue-500 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.profile?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profile.avatar}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span>{initials.toUpperCase()}</span>
        )}
      </button>
      {open && (
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ring-black">
          <div className="border-b px-4 py-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.profile
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user.username}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user.email || user.profile?.email}
            </p>
          </div>
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="/applications"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Applications
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
