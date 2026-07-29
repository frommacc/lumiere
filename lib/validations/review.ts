import { z } from 'zod'
import { ReviewStatus } from '@/lib/generated/prisma'

export const updateReviewModerationSchema = z.object({
  reviewId: z
    .string({ message: 'Идентификаторот е задолжителен.' })
    .min(1, 'Идентификаторот е задолжителен.'),
  status: z.enum(ReviewStatus, {
    message: 'Невалиден статус за рецензија.',
  }),
})

export const deleteReviewSchema = z.object({
  reviewId: z
    .string({ message: 'Идентификаторот е задолжителен.' })
    .min(1, 'Идентификаторот е задолжителен.'),
})
