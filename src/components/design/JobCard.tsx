import Link from 'next/link'
import { colors } from './tokens'
import { cn } from '@/lib/utils'

export interface JobCardProps {
  id: string | number
  title: string
  company: string
  location: string
  salary?: string
  type?: string
  level?: string
  postedAt?: string
  logoUrl?: string
  tags?: string[]
  saved?: boolean
  onToggleSave?: () => void
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  level,
  postedAt,
  logoUrl,
  tags = [],
  saved,
  onToggleSave,
}) => {
  return (
    <div className="group relative flex gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={company}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-500">LOGO</span>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/jobs/${id}`}
              className="block text-base font-semibold text-black hover:text-blue-600"
            >
              {title}
            </Link>
            <div className="mt-1 text-sm text-gray-600">
              {company} • {location}
            </div>
          </div>
          <button
            aria-label="Save job"
            onClick={onToggleSave}
            className={cn(
              'rounded-full p-2 transition',
              saved ? 'text-yellow-500' : 'text-gray-400 hover:text-blue-600'
            )}
          >
            {/* Simple bookmark icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={saved ? colors.accent : 'none'}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-3.75L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {type && <Tag>{type}</Tag>}
          {level && <Tag>{level}</Tag>}
          {tags.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{salary || 'Negotiable'}</span>
          <span>{postedAt}</span>
        </div>
      </div>
    </div>
  )
}

export const Tag: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
    {children}
  </span>
)
