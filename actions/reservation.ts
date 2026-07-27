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
    return { success: false, message: 'Најавете се за да направите резервација.' }
  }

  const tableTypes = await getReservationTableTypes()
  return { success: true, tableTypes }
}

export async function getReservationAvailabilityAction(input: {
  date: string
  tableTypeId: string
  guests: number
  durationMinutes: number
}): Promise<ReservationAvailabilityResult> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Најавете се за да продолжите.' }
  }

  const parsed = reservationFormSchema.pick({
    date: true,
    tableTypeId: true,
    guests: true,
    durationMinutes: true,
  }).safeParse(input)
  if (!parsed.success) {
    return { success: false, message: 'Изберете валиден датум, број на гости и тип на маса.' }
  }
  if (!isReservationDateBookable(parsed.data.date)) {
    return { success: false, message: 'Резервации се достапни до 90 дена однапред.' }
  }

  const tableTypes = await getReservationTableTypes()
  const tableType = tableTypes.find((type) => type.id === parsed.data.tableTypeId)
  if (!tableType) {
    return { success: false, message: 'Избраниот тип на маса не постои.' }
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
    return { success: false, message: 'Најавете се за да направите резервација.' }
  }

  const parsed = reservationFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверете ги внесените податоци.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const reservationData = parsed.data
  if (!isReservationDateBookable(reservationData.date)) {
    return { success: false, message: 'Избраниот датум не е достапен за резервација.' }
  }
  if (isReservationSlotInPast(reservationData.date, reservationData.time)) {
    return { success: false, message: 'Избраниот термин веќе помина.' }
  }

  const tableTypes = await getReservationTableTypes()
  const tableType = tableTypes.find(
    (type) => type.id === reservationData.tableTypeId,
  )
  if (!tableType) {
    return { success: false, message: 'Избраниот тип на маса не постои.' }
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
        message: 'Овој термин штотуку е резервиран. Изберете друг термин.',
      }
    }

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Барањето за резервација е успешно испратено.',
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
      message: 'Не успеавме да ја зачуваме резервацијата. Обидете се повторно.',
    }
  }
}
