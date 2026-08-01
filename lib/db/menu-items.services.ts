import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  image: true,

  isPublished: true,
  isAvailable: true,
  isOrderable: true,

  isPopular: true,
  isExclusive: true,
  isSpecial: true,

  ingredients: true,
  allergens: true,
  dietary: true,
  origin: true,
  preparation: true,
  pairing: true,

  categoryId: true,
  subcategoryId: true,

  category: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },

  subcategory: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
} as const

export async function getMenuItems(categoryId?: string) {
  'use cache'

  cacheLife('weeks')
  cacheTag('menu-items')

  const filterCategory = categoryId && categoryId !== 'all'

  if (filterCategory) {
    cacheTag(`menu-items-${categoryId}`)
  }

  return await prisma.menuItem.findMany({
    where: {
      isPublished: true,
      ...(filterCategory
        ? {
            category: {
              OR: [{ id: categoryId }, { slug: categoryId }],
            },
          }
        : {}),
    },
    select: menuItemSelect,
    orderBy: [
      // Прво сортираме според редоследот на подкатегоријата, па според артикалот
      { subcategory: { displayOrder: 'asc' } },
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

export async function getSpecialties() {
  return await prisma.menuItem.findMany({
    where: {
      isSpecial: true,
      isPublished: true,
      isAvailable: true,
    },
    take: 8,
    select: menuItemSelect,
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })
}
