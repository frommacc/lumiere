import { prisma } from '../prisma'

export const getReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reviews
}
