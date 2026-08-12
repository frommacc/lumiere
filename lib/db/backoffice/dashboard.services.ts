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
    // New orders (Pending)
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: end },
        status: OrderStatus.PENDING,
      },
    }),

    // Active bookings for today
    prisma.reservation.count({
      where: {
        startTime: { gte: start, lt: end },
        status: { in: activeReservationStatuses },
      },
    }),

    // Total tables
    prisma.table.count(),

    // Busy tables
    prisma.reservation.findMany({
      where: {
        startTime: { lt: end },
        endTime: { gt: start },
        status: { in: activeReservationStatuses },
      },
      distinct: ['tableId'],
      select: { tableId: true },
    }),

    // Last 5 orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
    }),

    // Reservations awaiting confirmation
    prisma.reservation.findMany({
      where: { status: ReservationStatus.PENDING },
      take: 5,
      orderBy: { startTime: 'asc' },
      include: { table: { include: { tableType: true } } },
    }),

    // Daily turnover
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start, lt: end },
        status: { not: OrderStatus.CANCELLED },
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: { total: true },
    }),

    // In the kitchen (Preparing)
    prisma.order.count({
      where: { status: OrderStatus.PREPARING },
    }),

    // Reviews pending approval
    prisma.review.count({
      where: { status: ReviewStatus.PENDING },
    }),

    // Top 5 best selling items
    prisma.orderItem.groupBy({
      by: ['name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // Unavailable menu items
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
