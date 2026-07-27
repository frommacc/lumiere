'use server'

import { headers } from 'next/headers'
import { updateTag } from 'next/cache'

import { auth } from '@/lib/auth'
import {
  createReview,
  getReviewEligibility,
  updateReviewStatus,
} from '@/lib/db/reviews.services'
import { ReviewStatus } from '@/lib/generated/prisma'
import { createReviewSchema, type CreateReviewValues } from '@/lib/validations/review'

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
    return { success: false, message: 'Најавете се за да оставите review.' }
  }

  const eligibility = await getReviewEligibility(user.id)
  if (!eligibility.allowed) {
    return {
      success: true,
      allowed: false,
      message:
        eligibility.eligibleExperiences === 0
          ? 'Review може да оставите по испорачана нарачка или завршена резервација.'
          : 'Веќе имате испратен review за сите ваши завршени искуства.',
    }
  }

  return {
    success: true,
    allowed: true,
    message: 'Споделете го вашето искуство со Lumière.',
  }
}

export async function createReviewAction(
  input: CreateReviewValues,
): Promise<{ success: true; message: string } | ReviewActionError> {
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, message: 'Најавете се за да оставите review.' }
  }

  const parsed = createReviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверете ги внесените податоци.',
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
        'За да оставите нов review, потребна е нова испорачана нарачка или завршена резервација.',
    }
  }

  return {
    success: true,
    message: 'Review-от е испратен на одобрување. Ќе биде јавно видлив по проверка.',
  }
}

export async function moderateReviewAction(
  reviewId: string,
  status: 'APPROVED' | 'REJECTED',
) {
  const user = await getAuthenticatedUser()
  if (!user || !user.role || !['ADMIN', 'MANAGER'].includes(user.role)) {
    return { success: false, message: 'Немате дозвола за модерирање reviews.' }
  }

  await updateReviewStatus(reviewId, status as ReviewStatus)
  updateTag('reviews')

  return { success: true, message: 'Статусот на review-от е ажуриран.' }
}
