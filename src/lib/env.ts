// Environment variables configuration
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,

  // OAuth Providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID!,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET!,

  // File Upload
  UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET!,
  UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID!,

  // Email
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST!,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT!,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER!,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD!,
  EMAIL_FROM: process.env.EMAIL_FROM!,

  // Application
  NODE_ENV: process.env.NODE_ENV!,
  APP_URL: process.env.APP_URL || 'http://localhost:3000',

  // Redis (for caching)
  REDIS_URL: process.env.REDIS_URL,

  // External APIs
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,

  // Analytics
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
}
