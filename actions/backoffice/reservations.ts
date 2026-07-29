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
