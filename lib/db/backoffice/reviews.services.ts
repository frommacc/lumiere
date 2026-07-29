import { ReviewStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

export async function getAdminReviews({
  status = ReviewStatus.PENDING,
  page = 1,
  limit = 8,
}: {
  status?: ReviewStatus
  page?: number
  limit?: number
}) {
  const skip = (page - 1) * limit

  const [reviews, totalCount, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      prisma.review.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
        },
      }),
      prisma.review.count({ where: { status } }),
      prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      prisma.review.count({ where: { status: ReviewStatus.APPROVED } }),
      prisma.review.count({ where: { status: ReviewStatus.REJECTED } }),
    ])

  return {
    reviews,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    counts: {
      PENDING: pendingCount,
      APPROVED: approvedCount,
      REJECTED: rejectedCount,
    },
  }
}
