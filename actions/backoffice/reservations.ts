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
    return { success: false, message: 'Invalid booking status.' }

  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER, Role.STAFF])

  if (!user) return forbidden()

  const reservation = await prisma.reservation.findUnique({
    where: { id: parsed.data.reservationId },
    select: { status: true },
  })

  if (!reservation)
    return { success: false, message: 'The reservation does not exist.' }

  const allowed = getAllowedReservationStatuses(
    user.role as Role,
    reservation.status,
  )

  if (!allowed.includes(parsed.data.status as ReservationStatus)) {
    return { success: false, message: 'This status transition is not allowed.' }
  }

  await prisma.reservation.update({
    where: { id: parsed.data.reservationId },
    data: { status: parsed.data.status },
  })

  refreshOperations()

  return { success: true, message: 'The booking status has been updated.' }
}

export async function deleteReservationAction(
  reservationId: string,
): Promise<ActionResult> {
  if (!reservationId || typeof reservationId !== 'string') {
    return { success: false, message: 'Invalid booking ID.' }
  }

  // Only ADMIN and MANAGER are allowed to delete a reservation
  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER])

  if (!user) return forbidden()

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { id: true },
  })

  if (!reservation) {
    return { success: false, message: 'The reservation does not exist.' }
  }

  await prisma.reservation.delete({
    where: { id: reservationId },
  })

  refreshOperations()

  return {
    success: true,
    message: 'The reservation has been successfully deleted.',
  }
}
