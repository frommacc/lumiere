import { z } from 'zod'
import { ReviewStatus } from '../generated/prisma'

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z
    .string()
    .trim()
    .min(20, 'Споделете барем 20 карактери од вашето искуство.')
    .max(1000, 'Review-от може да има најмногу 1000 карактери.'),
})

export type CreateReviewValues = z.infer<typeof createReviewSchema>

// ADMIN

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
