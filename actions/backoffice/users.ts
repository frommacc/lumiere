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
      message: parsed.error.issues[0]?.message || 'Невалидни податоци.',
    }
  }

  const { userId, name, phone, role, status } = parsed.data

  // Заштита: Admin не може да си го менува сопствениот статус или улога
  if (
    currentUser.id === userId &&
    (role !== currentUser.role || status !== currentUser.status)
  ) {
    return {
      success: false,
      message: 'Не можете да си ги промените сопствената улога или статус.',
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
      message: 'Податоците за корисникот се успешно ажурирани.',
    }
  } catch {
    return { success: false, message: 'Грешка при ажурирање на корисникот.' }
  }
}

export async function updateUserRoleAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateUserRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Невалидна улога.' }

  const user = await getAuthorizedUser([Role.ADMIN])
  if (!user) return forbidden()
  if (user.id === parsed.data.userId)
    return {
      success: false,
      message: 'Не можете да ја промените сопствената улога.',
    }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { role: true },
  })
  if (!target) return { success: false, message: 'Корисникот не постои.' }
  if (target.role === Role.ADMIN && parsed.data.role !== Role.ADMIN) {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } })
    if (admins <= 1)
      return {
        success: false,
        message: 'Мора да остане барем еден администратор.',
      }
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  })
  return { success: true, message: 'Улогата е успешно ажурирана.' }
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
      message: 'Не можете да го промените сопствениот статус.',
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
          ? 'Корисникот е успешно блокиран.'
          : 'Корисникот е успешно активиран.',
    }
  } catch {
    return { success: false, message: 'Грешка при менување на статусот.' }
  }
}

export async function deleteUserAction(userId: string) {
  const currentUser = await requireRouteAccess('/admin/users')

  if (currentUser.id === userId) {
    return { success: false, message: 'Не можете да се избришете самите себе.' }
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath('/admin/users')
    return { success: true, message: 'Корисникот е успешно избришан.' }
  } catch {
    return { success: false, message: 'Грешка при бришење на корисникот.' }
  }
}
