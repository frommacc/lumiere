import { OrderStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

export interface GetUserOrdersParams {
  userId: string
  query?: string
  limit?: number
}

export async function getUserOrders({
  userId,
  query,
  limit = 10,
}: GetUserOrdersParams) {
  const cleanQuery = query?.trim()

  const whereClause = {
    userId,
    ...(cleanQuery && {
      OR: [
        { orderNumber: { contains: cleanQuery, mode: 'insensitive' as const } },
        {
          items: {
            some: {
              name: { contains: cleanQuery, mode: 'insensitive' as const },
            },
          },
        },
      ],
    }),
  }

  // We execute two requests in one transaction for better performance
  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where: whereClause,
      take: limit,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.order.count({
      where: whereClause,
    }),
  ])

  return {
    orders,
    totalCount,
    hasMore: orders.length < totalCount,
  }
}

export async function getRecentUserOrders(userId: string, limit = 3) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { items: true },
  })
}

export async function getUserOrderStats(userId: string) {
  return prisma.order.aggregate({
    where: {
      userId,
      status: { not: OrderStatus.CANCELLED },
    },
    _count: { id: true },
    _sum: { total: true },
  })
}
