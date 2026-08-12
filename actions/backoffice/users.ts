'use server'

import { updateUserRoleSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'
import { getAuthorizedUser, requireRouteAccess } from '@/lib/authorization'
import { Role, UserStatus } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  UpdateUserFormValues,
  updateUserSchema,
} from '@/lib/validations/profile'

export async function updateAdminUserAction(input: UpdateUserFormValues) {
  const currentUser = await requireRouteAccess('/admin/users')

  const parsed = updateUserSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid data.',
    }
  }

  const { userId, name, phone, role, status } = parsed.data

  // Protection: Admin cannot change their own status or role
  if (
    currentUser.id === userId &&
    (role !== currentUser.role || status !== currentUser.status)
  ) {
    return {
      success: false,
      message: 'You cannot change your own role or status.',
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone, role, status },
    })

    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User data has been successfully updated.',
    }
  } catch {
    return { success: false, message: 'Error updating user.' }
  }
}

export async function updateUserRoleAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateUserRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Invalid role.' }

  const user = await getAuthorizedUser([Role.ADMIN])
  if (!user) return forbidden()
  if (user.id === parsed.data.userId)
    return {
      success: false,
      message: 'You cannot change your own role.',
    }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true },
  })
  if (!target) return { success: false, message: 'The user does not exist.' }
  if (target.role === Role.ADMIN && parsed.data.role !== Role.ADMIN) {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } })
    if (admins <= 1)
      return {
        success: false,
        message: 'At least one administrator must remain.',
      }
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  })
  return { success: true, message: 'The role has been successfully updated.' }
}

export async function updateUserStatusAction({
  userId,
  status,
}: {
  userId: string
  status: UserStatus
}) {
  const currentUser = await requireRouteAccess('/admin/users')

  if (currentUser.id === userId) {
    return {
      success: false,
      message: 'You cannot change your own status.',
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    })

    revalidatePath('/admin/users')
    return {
      success: true,
      message:
        status === UserStatus.BLOCKED
          ? 'The user has been successfully blocked.'
          : 'The user has been successfully activated.',
    }
  } catch {
    return { success: false, message: 'Error changing status.' }
  }
}

export async function deleteUserAction(userId: string) {
  const currentUser = await requireRouteAccess('/admin/users')

  if (currentUser.id === userId) {
    return { success: false, message: 'You cannot delete yourself.' }
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath('/admin/users')
    return { success: true, message: 'User deleted successfully.' }
  } catch {
    return { success: false, message: 'Error deleting user.' }
  }
}
