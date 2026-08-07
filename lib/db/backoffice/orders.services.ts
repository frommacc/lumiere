import { OrderStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getOptionalDateRange } from '@/lib/reservations'

export async function getAdminOrders({
  query,
  status,
  page = 1,
  pageSize = 20,
  from,
  to,
}: {
  query?: string
  status?: OrderStatus
  page?: number
  pageSize?: number
  from?: string
  to?: string
} = {}) {
  const term = query?.trim()
  const { start, end } = getOptionalDateRange(from, to)

  // Флексибилен филтер за датум во Prisma
  const createdAtFilter = {
    ...(start ? { gte: start } : {}),
    ...(end ? { lt: end } : {}), // 'lt' се користи бидејќи 'end' е почетокот на следниот ден
  }

  const where = {
    ...(status ? { status } : {}),
    ...(start || end ? { createdAt: createdAtFilter } : {}),
    ...(term
      ? {
          OR: [
            { orderNumber: { contains: term, mode: 'insensitive' as const } },
            { customerName: { contains: term, mode: 'insensitive' as const } },
            { phone: { contains: term, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const skip = (page - 1) * pageSize

  const [totalItems, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { items: true, user: { select: { name: true, email: true } } },
    }),
  ])

  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    orders,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  }
}

export async function getKitchenOrders() {
  return prisma.order.findMany({
    where: {
      status: {
        in: [
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.PREPARING,
          OrderStatus.READY,
        ],
      },
    },
    orderBy: { createdAt: 'asc' },
    include: { items: true },
  })
}

export async function getStaffOrders() {
  return prisma.order.findMany({
    where: {
      status: {
        in: [OrderStatus.PENDING, OrderStatus.READY, OrderStatus.IN_TRANSIT],
      },
    },
    orderBy: { updatedAt: 'asc' },
    include: { items: true },
  })
}
