import { prisma } from '@/lib/prisma'

export async function getAdminMenuItems(
  page: number = 1,
  pageSize: number = 10,
) {
  const skip = (page - 1) * pageSize

  const [items, totalItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
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
    prisma.menuItem.count(),

    // Ги влечеме сите категории заедно со нивните поткатегории
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
