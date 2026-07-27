import { z } from 'zod'

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z
    .string()
    .trim()
    .min(20, 'Споделете барем 20 карактери од вашето искуство.')
    .max(1000, 'Review-от може да има најмногу 1000 карактери.'),
})

export type CreateReviewValues = z.infer<typeof createReviewSchema>
