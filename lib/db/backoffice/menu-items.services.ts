import { Prisma } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

export async function getAdminMenuItems(
  q: string = '',
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize
  const query = q.trim()

  // We define the filter dynamically
  const where: Prisma.MenuItemWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }
    : {}

  const [items, totalItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        subcategory: {
          include: {
            category: true,
          },
        },
      },
      skip,
      take: pageSize,
    }),
    // Now count also uses the custom filter
    prisma.menuItem.count({ where }),

    // All categories and subcategories
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        subcategories: {
          orderBy: { displayOrder: 'asc' },
          select: { id: true, name: true },
        },
      },
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
