import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getDayRange } from '@/lib/reservations'
import {
  OrderStatus,
  PaymentStatus,
  ReservationStatus,
  ReviewStatus,
} from '@/lib/generated/prisma'

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
    newOrdersCount,
    activeReservationsCount,
    totalTablesCount,
    occupiedTables,
    recentOrders,
    pendingReservations,
    todayRevenue,
    kitchenOrdersCount,
    pendingReviewsCount,
    topSellingItems,
    unavailableMenuItemsCount,
  ] = await Promise.all([
    // Нови нарачки (Pending)
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: end },
        status: OrderStatus.PENDING,
      },
    }),

    // Активни резервации за денес
    prisma.reservation.count({
      where: {
        startTime: { gte: start, lt: end },
        status: { in: activeReservationStatuses },
      },
    }),

    // Вкупно маси
    prisma.table.count(),

    // Зафатени маси
    prisma.reservation.findMany({
      where: {
        startTime: { lt: end },
        endTime: { gt: start },
        status: { in: activeReservationStatuses },
      },
      distinct: ['tableId'],
      select: { tableId: true },
    }),

    // Последни 5 нарачки
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
    }),

    // Резервации кои чекаат потврда
    prisma.reservation.findMany({
      where: { status: ReservationStatus.PENDING },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { table: { include: { tableType: true } } },
    }),

    // Дневен промет
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start, lt: end },
        status: { not: OrderStatus.CANCELLED },
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: { total: true },
    }),

    // Во кујна (Preparing)
    prisma.order.count({
      where: { status: OrderStatus.PREPARING },
    }),

    // Рецензии кои чекаат одобрување
    prisma.review.count({
      where: { status: ReviewStatus.PENDING },
    }),

    // Топ 5 најпродавани артикли
    prisma.orderItem.groupBy({
      by: ['name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // Недостапни артикли во менито
    prisma.menuItem.count({
      where: { isAvailable: false },
    }),
  ])

  return {
    newOrders: newOrdersCount,
    activeReservations: activeReservationsCount,
    totalTables: totalTablesCount,
    occupiedTables: occupiedTables.length,
    recentOrders,
    pendingReservations,
    todayRevenue: todayRevenue._sum.total || 0,
    kitchenOrdersCount,
    pendingReviewsCount,
    topSellingItems,
    unavailableMenuItemsCount,
  }
}
