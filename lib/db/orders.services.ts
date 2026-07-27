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

  // Извршуваме две заявки во една трансакција за подобри перформанси
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
