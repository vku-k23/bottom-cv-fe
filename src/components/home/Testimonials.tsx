'use client'
import { useState } from 'react'

interface Testimonial {
  id: number
  author: string
  role: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: 'Robert Fox',
    role: 'UI/UX Designer',
    quote:
      'Ut ullamcorper hendrerit tempor. Aliquam in mi et mauris venenatis placerat metus in faucibus.',
  },
  {
    id: 2,
    author: 'Bessie Cooper',
    role: 'Creative Director',
    quote:
      'Mauris eget turpis elit. Mauris convallis justo non massa tristique iaculis. Suspendisse et aliquet turpis augue condimentum ornare.',
  },
  {
    id: 3,
    author: 'Jane Cooper',
    role: 'Photographer',
    quote:
      'Cras placerat volutpat felis nec lobortis. Maecenas imperdiet leo magna, in fringilla lorem fermentum.',
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-xl font-semibold text-gray-900 md:text-2xl">
          Clients Testimonial
        </h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="w-full flex-shrink-0 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  {t.author.charAt(0)}
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t.quote}
                </p>
                <p className="mt-4 text-sm font-semibold text-gray-900">
                  {t.author}
                </p>
                <p className="text-[11px] tracking-wide text-gray-400 uppercase">
                  {t.role}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  )
}
