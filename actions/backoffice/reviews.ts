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
 * Промена на статус на рецензија (APPROVED / REJECTED)
 */
export async function moderateReviewAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateReviewModerationSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      // ⬇️ Променето од .errors[0] во .issues[0]
      message: parsed.error.issues[0]?.message || 'Невалидни податоци.',
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
    return { success: true, message: 'Рецензијата е успешно модерирана.' }
  } catch (error) {
    console.error('Failed to moderate review:', error)
    return {
      success: false,
      message: 'Настана грешка при промена на статусот.',
    }
  }
}

/**
 * Трајно бришење на рецензија
 */
export async function deleteReviewAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = deleteReviewSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      // ⬇️ Променето од .errors[0] во .issues[0]
      message: parsed.error.issues[0]?.message || 'Невалиден идентификатор.',
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
    return { success: true, message: 'Рецензијата е успешно избришана.' }
  } catch (error) {
    console.error('Failed to delete review:', error)
    return {
      success: false,
      message: 'Настана грешка при бришење на рецензијата.',
    }
  }
}
