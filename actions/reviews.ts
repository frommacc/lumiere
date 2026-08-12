'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { createReview, getReviewEligibility } from '@/lib/db/reviews.services'
import {
  createReviewSchema,
  type CreateReviewValues,
} from '@/lib/validations/review'

type ReviewActionError = {
  success: false
  message: string
  fieldErrors?: Partial<Record<keyof CreateReviewValues, string[]>>
}

export type ReviewEligibilityResult =
  | { success: true; allowed: boolean; message: string }
  | ReviewActionError

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function getReviewEligibilityAction(): Promise<ReviewEligibilityResult> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Log in to leave a review.' }
  }

  const eligibility = await getReviewEligibility(user.id)
  if (!eligibility.allowed) {
    return {
      success: true,
      allowed: false,
      message:
        eligibility.eligibleExperiences === 0
          ? "You can leave a review after the order has been delivered or the reservation has been completed."
          : 'You have already sent a review for all your completed experiences.',
    }
  }

  return {
    success: true,
    allowed: true,
    message: 'Share your Lumière experience.',
  }
}

export async function createReviewAction(
  input: CreateReviewValues,
): Promise<{ success: true; message: string } | ReviewActionError> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Log in to leave a review.' }
  }

  const parsed = createReviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Check the entered data.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const review = await createReview({
    userId: user.id,
    name: user.name,
    ...parsed.data,
  })
  if (!review) {
    return {
      success: false,
      message:
        'To leave a new review, a new delivered order or completed reservation is required.',
    }
  }

  return {
    success: true,
    message:
      'The review has been sent for approval. It will be publicly visible after verification.',
  }
}
