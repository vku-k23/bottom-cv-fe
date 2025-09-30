import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

// Define supported locales
const locales = ['en', 'vi'] as const

type Locale = (typeof locales)[number]

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// next-intl routing middleware
const handleI18nRouting = createMiddleware(routing)

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/cv',
  '/apply',
  '/api/protected',
]

// Define routes that should redirect authenticated users
const authRoutes = ['/auth/signin', '/auth/signup']

export function middleware(request: NextRequest) {
  // Apply locale handling first (may rewrite "/" to "/en")
  const i18nResponse = handleI18nRouting(request)

  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1]
  const pathWithoutLocale = isLocale(firstSegment)
    ? pathname.slice(firstSegment.length + 1) || '/'
    : pathname

  // Get token from cookies or headers
  const token =
    request.cookies.get('access_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  )

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  )

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const currentLocale: Locale = isLocale(firstSegment) ? firstSegment : 'en'
    const url = new URL(`/${currentLocale}/auth/signin`, request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    const currentLocale: Locale = isLocale(firstSegment) ? firstSegment : 'en'
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url))
  }

  // Add CORS headers for API routes
  if (pathWithoutLocale.startsWith('/api/')) {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )

    return response
  }

  return i18nResponse
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all paths except for typical static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
