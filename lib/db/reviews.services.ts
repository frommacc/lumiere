import { OrderStatus, ReservationStatus, ReviewStatus } from '@/lib/generated/prisma'
import { prisma } from '../prisma'

export const getReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: { status: ReviewStatus.APPROVED },
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

export async function getReviewEligibility(userId: string) {
  const [deliveredOrders, completedReservations, activeReviews] =
    await prisma.$transaction([
      prisma.order.count({
        where: { userId, status: OrderStatus.DELIVERED },
      }),
      prisma.reservation.count({
        where: { userId, status: ReservationStatus.COMPLETED },
      }),
      prisma.review.count({
        where: {
          userId,
          status: { in: [ReviewStatus.PENDING, ReviewStatus.APPROVED] },
        },
      }),
    ])

  const eligibleExperiences = deliveredOrders + completedReservations

  return {
    eligibleExperiences,
    activeReviews,
    allowed: eligibleExperiences > activeReviews,
  }
}

export async function createReview({
  userId,
  name,
  rating,
  text,
}: {
  userId: string
  name: string
  rating: number
  text: string
}) {
  return prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`review:${userId}`}))`

    const [deliveredOrders, completedReservations, activeReviews] =
      await Promise.all([
        transaction.order.count({
          where: { userId, status: OrderStatus.DELIVERED },
        }),
        transaction.reservation.count({
          where: { userId, status: ReservationStatus.COMPLETED },
        }),
        transaction.review.count({
          where: {
            userId,
            status: { in: [ReviewStatus.PENDING, ReviewStatus.APPROVED] },
          },
        }),
      ])

    if (deliveredOrders + completedReservations <= activeReviews) return null

    return transaction.review.create({
      data: {
        userId,
        name,
        role: 'Потврден гостин',
        rating,
        text,
        status: ReviewStatus.PENDING,
      },
    })
  })
}

export async function updateReviewStatus(
  reviewId: string,
  status: ReviewStatus,
) {
  return prisma.review.update({
    where: { id: reviewId },
    data: { status },
  })
}
