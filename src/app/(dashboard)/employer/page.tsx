import { StatCard } from '@/components/design/StatCard'

export default function EmployerDashboardPage() {
  const stats = [
    { label: 'Active Jobs', value: 12, trend: '+2 this week' },
    { label: 'Applicants', value: 342, trend: '+18%' },
    { label: 'Interviews', value: 27, trend: '+5' },
    { label: 'Hires', value: 6, trend: '+1' },
  ]

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-xl font-bold text-black">Employer Dashboard</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Recent Applications
          </h2>
          <div className="space-y-3 text-sm">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-gray-800">Frontend Engineer</p>
                  <p className="text-xs text-gray-500">John Doe • 2h ago</p>
                </div>
                <button className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Job Performance
          </h2>
          <div className="flex h-48 w-full items-center justify-center rounded-md bg-gradient-to-br from-blue-50 to-purple-50 text-center text-xs text-gray-500">
            Chart Placeholder
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Active Job Posts
          </h2>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
            Post New Job
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-800">
                UI/UX Designer
              </p>
              <p className="mt-1 text-xs text-gray-500">
                12 applicants • 3d left
              </p>
              <button className="mt-3 text-xs font-medium text-blue-600 hover:underline">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
