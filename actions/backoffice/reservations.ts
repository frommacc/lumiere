'use server'

import { getAuthorizedUser } from '@/lib/authorization'
import { getAllowedReservationStatuses } from '@/lib/constants/operational-status'
import { prisma } from '@/lib/prisma'
import { ReservationStatus, Role } from '@/lib/generated/prisma'
import { updateReservationStatusSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden, refreshOperations } from '../utils'

export async function updateReservationStatusAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateReservationStatusSchema.safeParse(input)

  if (!parsed.success)
    return { success: false, message: 'Невалиден статус на резервација.' }

  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER, Role.STAFF])

  if (!user) return forbidden()

  const reservation = await prisma.reservation.findUnique({
    where: { id: parsed.data.reservationId },
    select: { status: true },
  })

  if (!reservation)
    return { success: false, message: 'Резервацијата не постои.' }

  const allowed = getAllowedReservationStatuses(
    user.role as Role,
    reservation.status,
  )

  if (!allowed.includes(parsed.data.status as ReservationStatus)) {
    return { success: false, message: 'Овој статусен премин не е дозволен.' }
  }

  await prisma.reservation.update({
    where: { id: parsed.data.reservationId },
    data: { status: parsed.data.status },
  })

  refreshOperations()

  return { success: true, message: 'Статусот на резервацијата е ажуриран.' }
}

export async function deleteReservationAction(
  reservationId: string,
): Promise<ActionResult> {
  if (!reservationId || typeof reservationId !== 'string') {
    return { success: false, message: 'Невалиден ID на резервација.' }
  }

  // Само ADMIN и MANAGER смеат да бришат резервација
  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER])

  if (!user) return forbidden()

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { id: true },
  })

  if (!reservation) {
    return { success: false, message: 'Резервацијата не постои.' }
  }

  await prisma.reservation.delete({
    where: { id: reservationId },
  })

  refreshOperations()

  return { success: true, message: 'Резервацијата е успешно избришана.' }
}
