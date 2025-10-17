import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">403</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Access Forbidden
        </h2>
        <p className="mb-8 text-gray-600">
          You don&apos;t have permission to access this resource.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
