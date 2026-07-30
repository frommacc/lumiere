import { OrderStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

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
