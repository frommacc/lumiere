import { z } from 'zod'
import { Role, UserStatus } from '../generated/prisma'

const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/

const isFile = (value: unknown): value is File =>  typeof File !== 'undefined' && value instanceof File

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'The name must have at least 2 characters.')
    .max(100, 'The name can have a maximum of 100 characters.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Enter a valid phone number.')
    .max(30, 'The phone number is too long.')
    .regex(phonePattern, 'Invalid phone number format.'),
  image: z
    .custom<File | undefined>(
      (value) => value === undefined || isFile(value),
      'Invalid image.',
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'The image can be a maximum of 5 MB.',
    )
    .refine(
      (file) =>        !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPG, PNG or WebP images are allowed.',
    )
    .optional(),
})

export type EditProfileFormValues = z.infer<typeof editProfileSchema>// ADMIN
export const updateUserSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, 'The name must contain at least 2 characters.'),
  phone: z.string().min(6, 'Enter a valid phone number.'),
  role: z.enum(Role),
  status: z.enum(UserStatus),
})
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
