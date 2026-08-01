import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '../prisma'

export async function getCategories() {
  'use cache'

  cacheLife('weeks')
  cacheTag('categories')

  return await prisma.category.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      displayOrder: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })
}

export async function getCategoriesWithSubcategories() {
  'use cache'

  cacheLife('weeks')
  cacheTag('categories')

  return await prisma.category.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      image: true,
      displayOrder: true,
      subcategories: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          displayOrder: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })
}
