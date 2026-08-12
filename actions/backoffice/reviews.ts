'use server'

import {
  updateReviewModerationSchema,
  deleteReviewSchema,
} from '@/lib/validations/review'
import { ActionResult, forbidden } from '../utils'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { getAuthorizedUser } from '@/lib/authorization'
import { prisma } from '@/lib/prisma'
import { updateTag } from 'next/cache'

/**
 * Change of review status (APPROVED / REJECTED)*/
export async function moderateReviewAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateReviewModerationSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      // ⬇️ Changed from .errors[0] to .issues[0]
      message: parsed.error.issues[0]?.message || 'Invalid data.',
    }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) {
    return forbidden()
  }

  try {
    await prisma.review.update({
      where: { id: parsed.data.reviewId },
      data: { status: parsed.data.status },
    })

    updateTag('reviews')
    return {
      success: true,
      message: 'The review has been successfully moderated.',
    }
  } catch (error) {
    console.error('Failed to moderate review:', error)
    return {
      success: false,
      message: 'An error occurred while changing the status.',
    }
  }
}

/**
 * Permanent deletion of a review
 */
export async function deleteReviewAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = deleteReviewSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      // ⬇️ Changed from .errors[0] to .issues[0]
      message: parsed.error.issues[0]?.message || 'Invalid identifier.',
    }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) {
    return forbidden()
  }

  try {
    await prisma.review.delete({
      where: { id: parsed.data.reviewId },
    })

    updateTag('reviews')
    return { success: true, message: 'Review successfully deleted.' }
  } catch (error) {
    console.error('Failed to delete review:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the review.',
    }
  }
}
