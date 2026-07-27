import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '../prisma'

export async function getCategories() {
  'use cache'

  cacheLife('weeks')
  cacheTag('categories')

  return await prisma.category.findMany({
    orderBy: {
      displayOrder: 'asc',
    },
  })
}
