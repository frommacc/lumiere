import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'Внесете валидна е-пошта адреса.' }),
  password: z.string().min(1, { message: 'Внесете лозинка.' }),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Името мора да има најмалку 2 карактери.' }),
    phone: z
      .string()
      .min(8, { message: 'Внесете валиден телефонски број.' })
      .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, {
        message: 'Невалиден формат за телефонски број.',
      }),
    email: z.email({ message: 'Внесете валидна е-пошта-адресa.' }),
    password: z
      .string()
      .min(8, { message: 'Лозинката мора да биде најмалку 8 карактери.' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Мора да ги прифатите условите и правилата.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Лозинките не се совпаѓаат.',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Внесете нова лозинка.' })
      .min(8, { message: 'Лозинката мора да содржи најмалку 8 карактери.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Потврдете ја новата лозинка.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Лозинките не се совпаѓаат.',
    path: ['confirmPassword'], // Грешката се прикажува под полето 'confirmPassword'
  })

// TypeScript тип за React Hook Form

// Извоз на TypeScript типот за реупотреба
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>
