'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import {
  createReservation,
  getAvailableReservationSlots,
  getReservationTableTypes,
} from '@/lib/db/reservations.services'
import {
  getReservationReference,
  isReservationDateBookable,
  isReservationSlotInPast,
} from '@/lib/reservations'
import {
  reservationFormSchema,
  type ReservationFormValues,
} from '@/lib/validations/reservation'

type FieldErrors = Partial<Record<keyof ReservationFormValues, string[]>>

type ActionError = {
  success: false
  message: string
  fieldErrors?: FieldErrors
}

export type ReservationTableTypesResult =
  | { success: true; tableTypes: Awaited<ReturnType<typeof getReservationTableTypes>> }
  | ActionError

export type ReservationAvailabilityResult =
  | { success: true; slots: string[] }
  | ActionError

export type CreateReservationResult =
  | {
      success: true
      message: string
      reservation: {
        reference: string
        date: string
        time: string
        guests: number
        durationMinutes: number
        tableTypeName: string
        name: string
        email: string
      }
    }
  | ActionError

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function getReservationTableTypesAction(): Promise<ReservationTableTypesResult> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Log in to make a reservation.' }
  }

  const tableTypes = await getReservationTableTypes()
  return { success: true, tableTypes }
}

export async function getReservationAvailabilityAction(input: {
  date: string
  tableTypeId : string
  guests: number
  durationMinutes: number
}): Promise<ReservationAvailabilityResult> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Sign in to continue.' }
  }

  const parsed = reservationFormSchema.pick({
    date: true,
    tableTypeId: true,
    guests: true,
    durationMinutes: true,
  }).safeParse(input)
  if (!parsed.success) {
    return { success: false, message: 'Select a valid date, number of guests and table type.' }
  }
  if (!isReservationDateBookable(parsed.data.date)) {
    return { success: false, message: 'Reservations are available up to 90 days in advance.' }
  }

  const tableTypes = await getReservationTableTypes()
  const tableType = tableTypes.find((type) => type.id === parsed.data.tableTypeId)
  if (!tableType) {
    return { success: false, message: 'The selected table type does not exist.' }
  }
  const slots = await getAvailableReservationSlots(
    parsed.data.date,
    parsed.data.tableTypeId,
    parsed.data.guests,
    parsed.data.durationMinutes,
  )
  return { success: true, slots: slots.map((slot) => slot.time) }
}

export async function createReservationAction(
  input: ReservationFormValues,
): Promise<CreateReservationResult> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Log in to make a reservation.' }
  }

  const parsed = reservationFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Check the entered data.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const reservationData = parsed.data
  if (!isReservationDateBookable(reservationData.date)) {
    return { success: false, message: 'The selected date is not available for booking.' }
  }
  if (isReservationSlotInPast(reservationData.date, reservationData.time)) {
    return { success: false, message: 'The selected term has already passed.' }
  }

  const tableTypes = await getReservationTableTypes()
  const tableType = tableTypes.find(
    (type) => type.id === reservationData.tableTypeId,
  )
  if (!tableType) {
    return { success: false, message: 'The selected table type does not exist.' }
  }
  try {
    const reservation = await createReservation({
      ...reservationData,
      specialRequests: reservationData.specialRequests || undefined,
      userId: user.id,
    })
    if (!reservation) {
      return {
        success: false,
        message: 'This appointment has just been booked. Choose another term.',
      }
    }

    revalidatePath('/profile')

    return {
      success: true,
      message: 'The booking request has been successfully sent.',
      reservation: {
        reference: getReservationReference(reservation.id),
        date: reservationData.date,
        time: reservationData.time,
        guests: reservation.guests,
        durationMinutes: reservation.durationMinutes,
        tableTypeName: reservation.table.tableType.name,
        name: reservation.name,
        email: reservation.email,
      },
    }
  } catch (error) {
    console.error('Create reservation failed:', error)
    return {
      success: false,
      message: 'We were unable to save the reservation. Try again.',
    }
  }
}
