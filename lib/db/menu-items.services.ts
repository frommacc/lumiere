import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  image: true,
  isPopular: true,
  isExclusive: true,
  isSpecial: true,
  isAvailable: true,
  ingredients: true,
  allergens: true,
  dietary: true,
  origin: true,
  preparation: true,
  pairing: true,
  categoryId: true,
  category: {
    select: {
      id: true,
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
      isAvailable: true,
      ...(filterCategory ? { categoryId } : {}),
    },
    select: menuItemSelect,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getSpecialties() {
  return await prisma.menuItem.findMany({
    where: {
      isSpecial: true,
      isAvailable: true,
    },
    select: menuItemSelect,
    orderBy: {
      createdAt: 'desc',
    },
  })
}
