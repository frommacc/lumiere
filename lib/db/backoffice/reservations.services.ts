import { ReservationStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getDayRange } from '@/lib/reservations'

export async function getAllPendingReservations() {
  return prisma.reservation.findMany({
    where: {
      status: ReservationStatus.PENDING,
    },
    orderBy: { startTime: 'asc' },
    include: {
      table: { include: { tableType: true } },
      user: { select: { name: true, email: true } },
    },
  })
}

// 2. All other (non-PENDING) reservations for a specific date
export async function getAgendaReservationsForDate(dateKey: string) {
  const { start, end } = getDayRange(dateKey)
  return prisma.reservation.findMany({
    where: {
      startTime: { gte: start, lt: end },
      status: { not: ReservationStatus.PENDING },
    },
    orderBy: { startTime: 'asc' },
    include: {
      table: { include: { tableType: true } },
      user: { select: { name: true, email: true } },
    },
  })
}
