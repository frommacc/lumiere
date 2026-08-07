'use server'

import { updateOrderStatusSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden, refreshOperations } from '../utils'
import { getAuthorizedUser } from '@/lib/authorization'
import { OrderStatus, Role } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getAllowedOrderStatuses } from '@/lib/constants/operational-status'
import { pusherServer } from '@/lib/pusher'

export async function updateOrderStatusAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateOrderStatusSchema.safeParse(input)
  if (!parsed.success)
    return { success: false, message: 'Невалиден статус на нарачка.' }

  const user = await getAuthorizedUser([
    Role.ADMIN,
    Role.MANAGER,
    Role.KITCHEN,
    Role.STAFF,
  ])
  if (!user) return forbidden()

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { status: true, deliveryMethod: true },
  })
  if (!order) return { success: false, message: 'Нарачката не постои.' }

  const allowed = getAllowedOrderStatuses(
    user.role as Role,
    order.status,
    order.deliveryMethod,
  )
  if (!allowed.includes(parsed.data.status as OrderStatus)) {
    return { success: false, message: 'Овој статусен премин не е дозволен.' }
  }

  const updatedOrder = await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
  })

  // PUSHER TRIGGER
  await pusherServer.trigger('kds-channel', 'order-status-updated', {
    orderId: updatedOrder.id,
    status: updatedOrder.status,
    updatedAt: updatedOrder.updatedAt,
  })

  refreshOperations()
  return { success: true, message: 'Статусот на нарачката е ажуриран.' }
}

export async function deleteOrderAction(
  orderId: string,
): Promise<ActionResult> {
  const user = await getAuthorizedUser([Role.ADMIN])
  if (!user) return forbidden()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  })

  if (!order) return { success: false, message: 'Нарачката не постои.' }

  await prisma.order.delete({
    where: { id: orderId },
  })

  refreshOperations()
  return { success: true, message: 'Нарачката е успешно избришана.' }
}
