import { ReservationStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getDayRange } from '@/lib/reservations'

export async function getAdminTables() {
  const { start, end } = getDayRange()
  return prisma.table.findMany({
    orderBy: { number: 'asc' },
    include: {
      tableType: true,
      reservations: {
        where: {
          startTime: { lt: end },
          endTime: { gt: start },
          status: {
            in: [ReservationStatus.CONFIRMED, ReservationStatus.SEATED],
          },
        },
        orderBy: { startTime: 'asc' },
        take: 1,
      },
    },
  })
}

export async function getAdminTableTypes() {
  return prisma.tableType.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { tables: true } } },
  })
}
