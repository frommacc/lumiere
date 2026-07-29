'use server'

import { updateTag } from 'next/cache'

import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { getAllowedOrderStatuses, getAllowedReservationStatuses } from '@/lib/constants/operational-status'
import { prisma } from '@/lib/prisma'
import {
  OrderStatus,
  ReservationStatus,
  ReviewStatus,
  Role,
} from '@/lib/generated/prisma'
import {
  tableSchema,
  tableTypeSchema,
  categorySchema,
  menuItemSchema,
  updateOrderStatusSchema,
  updateReservationStatusSchema,
  updateReviewModerationSchema,
  updateUserRoleSchema,
} from '@/lib/validations/backoffice'

type ActionResult = { success: true; message: string } | { success: false; message: string }

const forbidden = (): ActionResult => ({ success: false, message: 'Немате дозвола за оваа акција.' })

function refreshOperations() {
  updateTag('orders')
  updateTag('reservations')
  updateTag('tables')
  updateTag('admin-dashboard')
}

export async function updateOrderStatusAction(input: unknown): Promise<ActionResult> {
  const parsed = updateOrderStatusSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Невалиден статус на нарачка.' }

  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER, Role.KITCHEN, Role.STAFF])
  if (!user) return forbidden()

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { status: true, deliveryMethod: true },
  })
  if (!order) return { success: false, message: 'Нарачката не постои.' }

  const allowed = getAllowedOrderStatuses(user.role as Role, order.status, order.deliveryMethod)
  if (!allowed.includes(parsed.data.status as OrderStatus)) {
    return { success: false, message: 'Овој статусен премин не е дозволен.' }
  }

  await prisma.order.update({ where: { id: parsed.data.orderId }, data: { status: parsed.data.status } })
  refreshOperations()
  return { success: true, message: 'Статусот на нарачката е ажуриран.' }
}

export async function updateReservationStatusAction(input: unknown): Promise<ActionResult> {
  const parsed = updateReservationStatusSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Невалиден статус на резервација.' }

  const user = await getAuthorizedUser([Role.ADMIN, Role.MANAGER, Role.STAFF])
  if (!user) return forbidden()

  const reservation = await prisma.reservation.findUnique({
    where: { id: parsed.data.reservationId },
    select: { status: true },
  })
  if (!reservation) return { success: false, message: 'Резервацијата не постои.' }

  const allowed = getAllowedReservationStatuses(user.role as Role, reservation.status)
  if (!allowed.includes(parsed.data.status as ReservationStatus)) {
    return { success: false, message: 'Ovoj status premin ne e dozvolen.' }
  }

  await prisma.reservation.update({ where: { id: parsed.data.reservationId }, data: { status: parsed.data.status } })
  refreshOperations()
  return { success: true, message: 'Статусот на резервацијата е ажуриран.' }
}

export async function moderateReviewAction(input: unknown): Promise<ActionResult> {
  const parsed = updateReviewModerationSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Невалидна рецензија.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  await prisma.review.update({ where: { id: parsed.data.reviewId }, data: { status: parsed.data.status as ReviewStatus } })
  updateTag('reviews')
  return { success: true, message: 'Review-ot e moderiran.' }
}

export async function updateUserRoleAction(input: unknown): Promise<ActionResult> {
  const parsed = updateUserRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Невалидна улога.' }
  const user = await getAuthorizedUser([Role.ADMIN])
  if (!user) return forbidden()
  if (user.id === parsed.data.userId) return { success: false, message: 'Не можете да ја промените сопствената улога.' }

  const target = await prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { role: true } })
  if (!target) return { success: false, message: 'Корисникот не постои.' }
  if (target.role === Role.ADMIN && parsed.data.role !== Role.ADMIN) {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } })
    if (admins <= 1) return { success: false, message: 'Мора да остане барем еден администратор.' }
  }

  await prisma.user.update({ where: { id: parsed.data.userId }, data: { role: parsed.data.role } })
  return { success: true, message: 'Улогата е ажурирана.' }
}

export async function saveTableTypeAction(input: unknown): Promise<ActionResult> {
  const parsed = tableTypeSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Proverete gi podatocite za tipot na masa.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = { name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description || null }
  if (parsed.data.id) await prisma.tableType.update({ where: { id: parsed.data.id }, data })
  else await prisma.tableType.create({ data })
  updateTag('tables')
  updateTag('reservations')
  return { success: true, message: 'Tipot na masa e zachuvan.' }
}

export async function saveTableAction(input: unknown): Promise<ActionResult> {
  const parsed = tableSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Proverete gi podatocite za masata.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = { number: parsed.data.number, capacity: parsed.data.capacity, tableTypeId: parsed.data.tableTypeId }
  if (parsed.data.id) await prisma.table.update({ where: { id: parsed.data.id }, data })
  else await prisma.table.create({ data })
  updateTag('tables')
  updateTag('reservations')
  return { success: true, message: 'Masata e zachuvana.' }
}

export async function toggleMenuItemAvailabilityAction(itemId: string, isAvailable: boolean): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()
  await prisma.menuItem.update({ where: { id: itemId }, data: { isAvailable } })
  updateTag('menu-items')
  return { success: true, message: isAvailable ? 'Јадењето е достапно.' : 'Јадењето е повлечено од менито.' }
}

export async function saveCategoryAction(input: unknown): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Proverete gi podatocite za kategorijata.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image: parsed.data.image,
    displayOrder: parsed.data.displayOrder,
  }
  if (parsed.data.id) await prisma.category.update({ where: { id: parsed.data.id }, data })
  else await prisma.category.create({ data })
  updateTag('categories')
  updateTag('menu-items')
  return { success: true, message: 'Kategorijata e zachuvana.' }
}

export async function saveMenuItemAction(input: unknown): Promise<ActionResult> {
  const parsed = menuItemSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Proverete gi podatocite za jadenjeto.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = parsed.data
  if (data.id) await prisma.menuItem.update({ where: { id: data.id }, data: { ...data, id: undefined } })
  else await prisma.menuItem.create({ data })
  updateTag('menu-items')
  return { success: true, message: 'Jadenjeto e zachuvano.' }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()
  try {
    await prisma.menuItem.delete({ where: { id } })
    updateTag('menu-items')
    return { success: true, message: 'Jadenjeto e izbrishano.' }
  } catch {
    return { success: false, message: 'Jadenjeto ne mozhe da se izbrishe dodeka e povrzano so narachki.' }
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()
  const used = await prisma.menuItem.count({ where: { categoryId: id } })
  if (used) return { success: false, message: 'Prvo premestete ili izbrishete gi jadenjata od kategorijata.' }
  await prisma.category.delete({ where: { id } })
  updateTag('categories')
  updateTag('menu-items')
  return { success: true, message: 'Kategorijata e izbrishana.' }
}
