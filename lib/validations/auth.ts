import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Enter a password.' }),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'The name must have at least 2 characters.' }),
    phone: z
      .string()
      .min(8, { message: 'Enter a valid phone number.' })
      .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, {
        message: 'Invalid phone number format.',
      }),
    email: z.email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Enter a new password.' })
      .min(8, { message: 'Password must contain at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm the new password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'], // The error is displayed under the 'confirmPassword' field
  })

// TypeScript type for React Hook Form

// Export the TypeScript type for reuse
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>
