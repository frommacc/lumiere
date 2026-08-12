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
    .refine(isValidReservationDateKey, 'Please select a valid date.'),
  time: z
    .string()
    .refine(isValidReservationTime, 'Select an available appointment.'),
  guests: z
    .number()
    .int('The number of guests must be an integer.')
    .min(1, 'Select at least one person.')
    .max(14, 'For groups over 14 people, contact us directly.'),
  durationMinutes: z
    .number()
    .int()
    .refine(
      isValidReservationDuration,
      'Select a valid scheduled seating time.',
    ),
  tableTypeId: z.string().cuid('Select a table type.'),
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
  email: z.email('Please enter a valid email address.'),
  specialRequests: z
    .string()
    .trim()
    .max(500, 'Special requests can have a maximum of 500 characters.')
    .optional(),
})

export type ReservationFormValues = z.infer<typeof reservationFormSchema>
