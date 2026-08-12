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
      message: 'Check table type data.',
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
  return { success: true, message: 'Table type saved.' }
}

export async function saveTableAction(input: unknown): Promise<ActionResult> {
  const parsed = tableSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: 'Check table data.' }
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
  return { success: true, message: 'The table has been saved.' }
}

export async function deleteTableAction(id: string): Promise<ActionResult> {
  if (!id) {
    return { success: false, message: 'Invalid table ID.' }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  try {
    await prisma.table.delete({
      where: { id },
    })

    updateTag('tables')
    updateTag('reservations')

    return { success: true, message: 'The table was successfully deleted.' }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message:
        'An error occurred while deleting the table (there may be related reservations).',
    }
  }
}

export async function deleteTableTypeAction(id: string): Promise<ActionResult> {
  if (!id) {
    return { success: false, message: 'Invalid table type ID.' }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  try {
    // Checking for tables of this type before deletion
    const tablesCount = await prisma.table.count({
      where: { tableTypeId: id },
    })

    if (tablesCount > 0) {
      return {
        success: false,
        message:
          'The type cannot be deleted because it has tables associated with it.',
      }
    }

    await prisma.tableType.delete({
      where: { id },
    })

    updateTag('tables')
    updateTag('reservations')

    return {
      success: true,
      message: 'The table type has been successfully deleted.',
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'An error occurred while deleting the table type.',
    }
  }
}
