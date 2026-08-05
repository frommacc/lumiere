import { prisma } from '@/lib/prisma'

export async function getAdminCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: {
          subcategories: true,
          menuItems: true,
        },
      },
    },
  })
}

export async function getAdminSubcategories() {
  return prisma.subcategory.findMany({
    orderBy: [{ categoryId: 'asc' }, { displayOrder: 'asc' }],
    include: {
      category: {
        select: { id: true, name: true },
      },
      _count: {
        select: { menuItems: true },
      },
    },
  })
}
