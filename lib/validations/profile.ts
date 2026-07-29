import { z } from 'zod'
import { Role, UserStatus } from '../generated/prisma'

const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/

const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Името мора да има најмалку 2 карактери.')
    .max(100, 'Името може да има најмногу 100 карактери.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Внесете валиден телефонски број.')
    .max(30, 'Телефонскиот број е предолг.')
    .regex(phonePattern, 'Невалиден формат за телефонски број.'),
  image: z
    .custom<File | undefined>(
      (value) => value === undefined || isFile(value),
      'Невалидна слика.',
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'Сликата може да биде најмногу 5 MB.',
    )
    .refine(
      (file) =>
        !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Дозволени се само JPG, PNG или WebP слики.',
    )
    .optional(),
})

export type EditProfileFormValues = z.infer<typeof editProfileSchema>

// ADMIN
export const updateUserSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, 'Името мора да содржи барем 2 карактери.'),
  phone: z.string().min(6, 'Внесете валиден телефонски број.'),
  role: z.enum(Role),
  status: z.enum(UserStatus),
})
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
