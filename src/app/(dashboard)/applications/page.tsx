'use client'

import { useState } from 'react'

export default function ApplicationsPage() {
  const [applications] = useState(
    Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1000,
      title: 'Frontend Engineer',
      company: 'Acme Corp',
      appliedAt: '2025-08-0' + ((i % 9) + 1),
      status: ['Pending', 'Interview', 'Rejected', 'Offer'][i % 4],
    }))
  )

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-black">My Applications</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Job
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Applied
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {app.title}
                </td>
                <td className="px-4 py-3 text-gray-600">{app.company}</td>
                <td className="px-4 py-3 text-gray-600">{app.appliedAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      app.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : app.status === 'Interview'
                          ? 'bg-blue-100 text-blue-700'
                          : app.status === 'Offer'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs font-medium">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
