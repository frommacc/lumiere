import { z } from 'zod'
import { ReviewStatus } from '../generated/prisma'

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z
    .string()
    .trim()
    .min(20, 'Share at least 20 characters from your experience.')
    .max(1000, 'The review can have a maximum of 1000 characters.'),
})

export type CreateReviewValues = z.infer<typeof createReviewSchema>

// ADMIN

export const updateReviewModerationSchema = z.object({
  reviewId: z
    .string({ message: 'Identifier is required.' })
    .min(1, 'Identifier is required.'),
  status: z.enum(ReviewStatus, {
    message: 'Invalid review status.',
  }),
})

export const deleteReviewSchema = z.object({
  reviewId: z
    .string({ message: 'Identifier is required.' })
    .min(1, 'Identifier is required.'),
})
