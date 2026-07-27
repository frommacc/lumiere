import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Внесете ја тековната лозинка.'),
    newPassword: z
      .string()
      .min(8, 'Новата лозинка мора да има најмалку 8 карактери.'),
    confirmPassword: z.string().min(1, 'Потврдете ја новата лозинка.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Новите лозинки не се совпаѓаат.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Новата лозинка мора да се разликува од тековната.',
    path: ['newPassword'],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
