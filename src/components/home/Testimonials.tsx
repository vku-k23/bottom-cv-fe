'use client'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  id: number
  author: string
  role: string
  company: string
  quote: string
  rating: number
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: 'Robert Fox',
    role: 'UI/UX Designer',
    company: 'Google',
    quote:
      'This platform helped me find my dream job at Google. The application process was smooth and the support team was amazing throughout the journey.',
    rating: 5,
    avatar: 'RF',
  },
  {
    id: 2,
    author: 'Bessie Cooper',
    role: 'Creative Director',
    company: 'Microsoft',
    quote:
      'I was able to connect with top companies and land multiple interviews within weeks. The job matching algorithm is incredibly accurate.',
    rating: 5,
    avatar: 'BC',
  },
  {
    id: 3,
    author: 'Jane Cooper',
    role: 'Product Manager',
    company: 'Apple',
    quote:
      "The platform made job searching effortless. I found my current role at Apple through this platform and couldn't be happier.",
    rating: 5,
    avatar: 'JC',
  },
  {
    id: 4,
    author: 'Alex Johnson',
    role: 'Software Engineer',
    company: 'Meta',
    quote:
      'Excellent platform with great user experience. The job recommendations were spot-on and helped me advance my career significantly.',
    rating: 5,
    avatar: 'AJ',
  },
]

export function Testimonials() {
  const { t } = useTranslation()
  const [_index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {t('Testimonials.heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t('Testimonials.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="mb-6 text-gray-600">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
