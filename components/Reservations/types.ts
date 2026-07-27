import type { Prisma } from '@/lib/generated/prisma'

export type ReservationWithTable = Prisma.ReservationGetPayload<{
  include: {
    table: {
      select: {
        number: true
        capacity: true
        tableType: { select: { name: true } }
      }
    }
  }
}>
