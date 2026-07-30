import { ReservationStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import {
  generateReservationSlots,
  getDayOfWeek,
  getDayRange,
  isReservationSlotInPast,
  parseWorkingTimeRanges,
  type ReservationSlot,
} from '@/lib/reservations'

export type ReservationTableType = {
  id: string
  slug: string
  name: string
  description: string | null
}

export async function getReservationTableTypes(): Promise<
  ReservationTableType[]
> {
  const tableTypes = await prisma.tableType.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
    orderBy: { name: 'asc' },
  })

  return tableTypes.map((tableType) => ({
    id: tableType.id,
    slug: tableType.slug,
    name: tableType.name,
    description: tableType.description,
  }))
}

type EffectiveSchedule = {
  isWorking: boolean
  slots: unknown
}

export async function getEffectiveSchedule(
  date: string,
): Promise<EffectiveSchedule | null> {
  const scheduleOverride = await prisma.scheduleOverride.findUnique({
    where: { dateString: date },
    select: { isWorking: true, slots: true },
  })
  if (scheduleOverride) return scheduleOverride

  return prisma.workingHours.findUnique({
    where: { dayOfWeek: getDayOfWeek(date) },
    select: { isWorking: true, slots: true },
  })
}

export async function getReservationSlotsForDate(
  date: string,
  durationMinutes: number,
): Promise<ReservationSlot[]> {
  const schedule = await getEffectiveSchedule(date)
  if (!schedule?.isWorking) return []

  return generateReservationSlots(
    date,
    parseWorkingTimeRanges(schedule.slots),
    durationMinutes,
  )
}

export async function getAvailableReservationSlots(
  date: string,
  tableTypeId: string,
  guests: number,
  durationMinutes: number,
) {
  const [slots, tables] = await Promise.all([
    getReservationSlotsForDate(date, durationMinutes),
    prisma.table.findMany({
      where: {
        tableTypeId,
        capacity: { gte: guests },
      },
      select: { id: true },
    }),
  ])

  if (!slots.length || !tables.length) return []

  const earliestStart = slots[0].startTime
  const latestEnd = slots.at(-1)!.endTime
  const reservations = await prisma.reservation.findMany({
    where: {
      tableId: { in: tables.map((table) => table.id) },
      status: { not: ReservationStatus.CANCELLED },
      startTime: { lt: latestEnd },
      endTime: { gt: earliestStart },
    },
    select: {
      tableId: true,
      startTime: true,
      endTime: true,
    },
  })

  return slots.filter((slot) => {
    if (isReservationSlotInPast(date, slot.time)) return false

    return tables.some(
      (table) =>
        !reservations.some(
          (reservation) =>
            reservation.tableId === table.id &&
            reservation.startTime < slot.endTime &&
            reservation.endTime > slot.startTime,
        ),
    )
  })
}

type CreateReservationData = {
  date: string
  time: string
  guests: number
  name: string
  phone: string
  email: string
  specialRequests?: string
  tableTypeId: string
  durationMinutes: number
  userId: string
}

export async function createReservation(data: CreateReservationData) {
  const slots = await getReservationSlotsForDate(
    data.date,
    data.durationMinutes,
  )
  const selectedSlot = slots.find((slot) => slot.time === data.time)
  if (!selectedSlot || isReservationSlotInPast(data.date, data.time))
    return null

  const lockKey = `${data.tableTypeId}:${selectedSlot.startTime.toISOString()}`

  return prisma.$transaction(async (transaction) => {
    // Serialize requests for this type and start time before table allocation.
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`

    const tables = await transaction.table.findMany({
      where: {
        tableTypeId: data.tableTypeId,
        capacity: { gte: data.guests },
      },
      orderBy: [{ capacity: 'asc' }, { number: 'asc' }],
      select: { id: true },
    })
    if (!tables.length) return null

    const reservations = await transaction.reservation.findMany({
      where: {
        tableId: { in: tables.map((table) => table.id) },
        status: { not: ReservationStatus.CANCELLED },
        startTime: { lt: selectedSlot.endTime },
        endTime: { gt: selectedSlot.startTime },
      },
      select: { tableId: true },
    })
    const reservedTableIds = new Set(
      reservations.map((reservation) => reservation.tableId),
    )
    const table = tables.find(
      (candidate) => !reservedTableIds.has(candidate.id),
    )
    if (!table) return null

    return transaction.reservation.create({
      data: {
        guests: data.guests,
        name: data.name,
        phone: data.phone,
        email: data.email,
        specialRequests: data.specialRequests,
        durationMinutes: data.durationMinutes,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        tableId: table.id,
        userId: data.userId,
      },
      include: {
        table: {
          select: {
            number: true,
            tableType: { select: { name: true } },
          },
        },
      },
    })
  })
}

export async function getLatestUserReservation(userId: string) {
  return prisma.reservation.findFirst({
    where: { userId },
    orderBy: { startTime: 'desc' },
    include: {
      table: {
        select: {
          tableType: { select: { name: true } },
        },
      },
    },
  })
}

export async function getUserReservations({
  userId,
  limit = 10,
}: {
  userId: string
  limit?: number
}) {
  const [reservations, totalCount] = await prisma.$transaction([
    prisma.reservation.findMany({
      where: { userId },
      take: limit,
      orderBy: { startTime: 'desc' },
      include: {
        table: {
          select: {
            number: true,
            capacity: true,
            tableType: { select: { name: true } },
          },
        },
      },
    }),
    prisma.reservation.count({ where: { userId } }),
  ])

  return {
    reservations,
    totalCount,
    hasMore: reservations.length < totalCount,
  }
}

// ADMIN RESERVATIONS
// export async function getAdminReservations({
//   date,
//   status,
// }: { date?: string; status?: ReservationStatus } = {}) {
//   const { start, end } = getDayRange(date)
//   return prisma.reservation.findMany({
//     where: {
//       startTime: { gte: start, lt: end },
//       ...(status ? { status } : {}),
//     },
//     take: 100,
//     orderBy: { startTime: 'asc' },
//     include: {
//       table: { include: { tableType: true } },
//       user: { select: { name: true, email: true } },
//     },
//   })
// }

export async function getAdminReservations({ date }: { date?: string } = {}) {
  const { start, end } = getDayRange(date)
  return prisma.reservation.findMany({
    where: {
      startTime: { gte: start, lt: end },
    },
    take: 100,
    orderBy: { startTime: 'asc' },
    include: {
      table: { include: { tableType: true } },
      user: { select: { name: true, email: true } },
    },
  })
}

export async function getStaffReservations() {
  return getAdminReservations()
}
