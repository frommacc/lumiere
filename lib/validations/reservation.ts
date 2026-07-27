import { z } from 'zod'

import {
  isValidReservationDateKey,
  isValidReservationDuration,
  isValidReservationTime,
} from '@/lib/reservations'

const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/

export const reservationFormSchema = z.object({
  date: z
    .string()
    .refine(isValidReservationDateKey, 'Изберете валиден датум.'),
  time: z
    .string()
    .refine(isValidReservationTime, 'Изберете достапен термин.'),
  guests: z
    .number()
    .int('Бројот на гости мора да е цел број.')
    .min(1, 'Изберете најмалку едно лице.')
    .max(14, 'За групи над 14 лица, контактирајте нè директно.'),
  durationMinutes: z
    .number()
    .int()
    .refine(
      isValidReservationDuration,
      'Изберете валидно планирано време на седење.',
    ),
  tableTypeId: z.string().cuid('Изберете тип на маса.'),
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
  email: z.email('Внесете валидна е-пошта.'),
  specialRequests: z
    .string()
    .trim()
    .max(500, 'Посебните барања може да имаат најмногу 500 карактери.')
    .optional(),
})

export type ReservationFormValues = z.infer<typeof reservationFormSchema>
