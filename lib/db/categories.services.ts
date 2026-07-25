import { prisma } from '../prisma'

export async function getCategories() {
  'use cache'

  return await prisma.category.findMany({
    orderBy: {
      displayOrder: 'asc',
    },
  })
}
