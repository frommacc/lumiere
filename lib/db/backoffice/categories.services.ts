import { prisma } from '@/lib/prisma'

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
