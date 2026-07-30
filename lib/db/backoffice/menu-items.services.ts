import { prisma } from '@/lib/prisma'

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
