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
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be between 3 and 50 characters')
      .max(50, 'Username must be between 3 and 50 characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain like Az0@1 and be at least 6 characters long'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^[0-9]{10,15}$/,
        'Phone number must contain only digits and be between 10-15 characters'
      ),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(3, 'First name must between 3 and 25 character')
      .max(25, 'First name must between 3 and 25 character'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(3, 'Last name must between 3 and 25 character')
      .max(25, 'Last name must between 3 and 25 character'),
    dayOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((date) => {
        const birthDate = new Date(date)
        const today = new Date()
        return birthDate < today
      }, 'Date of birth must be in the past'),
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
