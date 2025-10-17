import React, { useState, useRef, useEffect } from 'react'
import { User } from '@/types/auth'
import Image from 'next/image'
import Link from 'next/link'

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

  // Support backend returning either nested profile (user.profile) or flat fields directly on user
  const flatCandidate = user as unknown as {
    firstName?: string
    lastName?: string
    avatar?: string | null
    username?: string
  }
  const profileLike =
    user.profile ||
    (flatCandidate.firstName !== undefined ||
    flatCandidate.lastName !== undefined
      ? flatCandidate
      : undefined)
  // (initialsRaw removed; we compute initial inline when rendering)
  // initials retained via lastName/firstName fallback directly in render, previous variable removed

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-medium text-gray-700 hover:ring-2 hover:ring-blue-500 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {profileLike?.avatar ? (
          <Image
            src={profileLike.avatar}
            alt="avatar"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="text-base font-semibold select-none">
            {(
              profileLike?.lastName?.[0] ||
              profileLike?.firstName?.[0] ||
              (user as unknown as { username?: string }).username?.[0] ||
              '?'
            ).toUpperCase()}
          </span>
        )}
      </button>
      {open && (
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ring-black">
          <div className="border-b border-gray-200 px-4 py-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {profileLike?.firstName || profileLike?.lastName
                ? `${profileLike?.firstName ?? ''} ${profileLike?.lastName ?? ''}`.trim()
                : user.username}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user.username || profileLike?.firstName || profileLike?.lastName}
            </p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            href="/applications"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Applications
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
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
