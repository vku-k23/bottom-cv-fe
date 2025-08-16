import { z } from 'zod'

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

// Signup form validation schema
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^[0-9]{10,15}$/,
        'Phone number must contain only digits and be between 10-15 characters'
      ),
    dayOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((date) => {
        const birthDate = new Date(date)
        const today = new Date()
        return birthDate < today
      }, 'Date of birth must be in the past'),
    address: z.string().optional(),
    role: z.enum(['USER', 'HR']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

// Validation helper functions
export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}

export const validateSignup = (data: unknown) => {
  return signupSchema.safeParse(data)
}

// Password strength checker
export const getPasswordStrength = (password: string) => {
  let strength = 0
  const checks = [
    /[a-z]/, // lowercase
    /[A-Z]/, // uppercase
    /[0-9]/, // numbers
    /[@$!%*?&]/, // special characters
    /.{8,}/, // minimum length
  ]

  checks.forEach((check) => {
    if (check.test(password)) strength++
  })

  if (strength < 2) return 'weak'
  if (strength < 4) return 'medium'
  if (strength === 5) return 'strong'
  return 'medium'
}
