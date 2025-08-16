'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const faqs = [
    {
      q: 'How quickly do you respond?',
      a: 'We aim to reply within 24 hours on business days.',
    },
    {
      q: 'Can I request a feature?',
      a: 'Yes, send details through the form and select Feature Request as subject.',
    },
    {
      q: 'Do you offer enterprise plans?',
      a: 'Enterprise options are in private beta. Contact us for details.',
    },
  ]
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-black">Contact Us</h1>
        <p className="mt-3 text-gray-600">
          We&apos;d love to hear from you. Send questions, feedback, or ideas.
        </p>
      </div>
      <div className="grid gap-10 md:grid-cols-3">
        <form
          onSubmit={submit}
          className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-gray-700 uppercase">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-gray-700 uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={onChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              required
              rows={5}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">We respect your privacy.</p>
            <button
              disabled={submitted}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitted ? 'Sent ✓' : 'Send Message'}
            </button>
          </div>
        </form>
        <aside className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Company
            </h2>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
                <strong className="text-gray-800">Email:</strong>{' '}
                support@example.com
              </li>
              <li>
                <strong className="text-gray-800">Address:</strong> Remote /
                Global
              </li>
              <li>
                <strong className="text-gray-800">Hours:</strong> Mon - Fri, 9am
                - 6pm
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">FAQ</h2>
            <ul className="space-y-4 text-sm">
              {faqs.map((f, _i) => (
                <li key={f.q}>
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-800 select-none marker:hidden">
                      {f.q}
                      <span className="ml-2 text-gray-400 transition group-open:rotate-180">
                        ⌄
                      </span>
                    </summary>
                    <p className="mt-2 text-gray-600">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
