import { OrderStatus, ReservationStatus } from '@/lib/generated/prisma'
import { cacheLife, cacheTag } from 'next/cache'
import { getReservationDateKey, zonedDateTimeToUtc } from '@/lib/reservations'
import { prisma } from '@/lib/prisma'

function getDayRange(dateKey = getReservationDateKey(new Date())) {
  return {
    dateKey,
    start: zonedDateTimeToUtc(dateKey, '00:00'),
    end: zonedDateTimeToUtc(
      getReservationDateKey(
        new Date(zonedDateTimeToUtc(dateKey, '00:00').getTime() + 86_400_000),
      ),
      '00:00',
    ),
  }
}

export async function getAdminDashboard() {
  'use cache'

  cacheLife('minutes')
  cacheTag('admin-dashboard')
  const { start, end } = getDayRange()
  const activeReservationStatuses = [
    ReservationStatus.CONFIRMED,
    ReservationStatus.SEATED,
  ]

  const [
    newOrders,
    activeReservations,
    totalTables,
    occupiedTables,
    recentOrders,
    pendingReservations,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: end },
        status: OrderStatus.PENDING,
      },
    }),
    prisma.reservation.count({
      where: {
        startTime: { gte: start, lt: end },
        status: { in: activeReservationStatuses },
      },
    }),
    prisma.table.count(),
    prisma.reservation.findMany({
      where: {
        startTime: { lt: end },
        endTime: { gt: start },
        status: { in: activeReservationStatuses },
      },
      distinct: ['tableId'],
      select: { tableId: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { items: true, user: { select: { name: true } } },
    }),
    prisma.reservation.findMany({
      where: { status: ReservationStatus.PENDING },
      take: 6,
      orderBy: { startTime: 'asc' },
      include: { table: { include: { tableType: true } } },
    }),
  ])

  return {
    newOrders,
    activeReservations,
    totalTables,
    occupiedTables: occupiedTables.length,
    recentOrders,
    pendingReservations,
  }
}

export async function getAdminOrders({
  query,
  status,
}: { query?: string; status?: OrderStatus } = {}) {
  const term = query?.trim()
  return prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(term
        ? {
            OR: [
              { orderNumber: { contains: term, mode: 'insensitive' } },
              { customerName: { contains: term, mode: 'insensitive' } },
              { phone: { contains: term, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: { select: { name: true, email: true } } },
  })
}

export async function getKitchenOrders() {
  return prisma.order.findMany({
    where: {
      status: {
        in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
      },
    },
    take: 100,
    orderBy: { createdAt: 'asc' },
    include: { items: true },
  })
}

export async function getStaffOrders() {
  return prisma.order.findMany({
    where: { status: { in: [OrderStatus.READY, OrderStatus.IN_TRANSIT] } },
    take: 100,
    orderBy: { updatedAt: 'asc' },
    include: { items: true },
  })
}

export async function getAdminReservations({
  date,
  status,
}: { date?: string; status?: ReservationStatus } = {}) {
  const { start, end } = getDayRange(date)
  return prisma.reservation.findMany({
    where: {
      startTime: { gte: start, lt: end },
      ...(status ? { status } : {}),
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

export async function getAdminMenuItems(
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize

  const [items, totalItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
      skip,
      take: pageSize,
    }),
    prisma.menuItem.count(),

    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    items,
    categories,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    },
  }
}

// 2. За посебната страница /admin/menu/categories
export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { menuItems: true },
      },
    },
  })
}
