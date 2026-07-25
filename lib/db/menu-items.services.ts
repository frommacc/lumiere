import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function getMenuItems(categoryId?: string) {
  'use cache'

  cacheLife('weeks')

  cacheTag('menu-items')
  if (categoryId && categoryId !== 'all') {
    cacheTag(`menu-items-${categoryId}`)
  }

  return await prisma.menuItem.findMany({
    where: categoryId && categoryId !== 'all' ? { categoryId } : undefined,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isPopular: true,
      isExclusive: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provenance: {
        select: {
          id: true,
          title: true,
          origin: true,
          image: true,
          details: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getSpecialties() {
  return await prisma.menuItem.findMany({
    where: {
      isSpecial: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      isPopular: true,
      isExclusive: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provenance: {
        select: {
          id: true,
          title: true,
          origin: true,
          image: true,
          details: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
