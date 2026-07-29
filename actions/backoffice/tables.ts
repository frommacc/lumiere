'use server'

import { updateTag } from 'next/cache'

import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'

import { prisma } from '@/lib/prisma'
import { tableSchema, tableTypeSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'

export async function saveTableTypeAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = tableTypeSchema.safeParse(input)
  if (!parsed.success)
    return {
      success: false,
      message: 'Проверете ги податоците за типот на маса.',
    }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
  }
  if (parsed.data.id)
    await prisma.tableType.update({ where: { id: parsed.data.id }, data })
  else await prisma.tableType.create({ data })
  updateTag('tables')
  updateTag('reservations')
  return { success: true, message: 'Типот на маса е зачуван.' }
}

export async function saveTableAction(input: unknown): Promise<ActionResult> {
  const parsed = tableSchema.safeParse(input)
  if (!parsed.success)
    return { success: false, message: 'Проверете ги податоците за масата.' }
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = {
    number: parsed.data.number,
    capacity: parsed.data.capacity,
    tableTypeId: parsed.data.tableTypeId,
  }
  if (parsed.data.id)
    await prisma.table.update({ where: { id: parsed.data.id }, data })
  else await prisma.table.create({ data })
  updateTag('tables')
  updateTag('reservations')
  return { success: true, message: 'Масата е зачувана.' }
}
