'use server'

import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { subcategorySchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'
import { prisma } from '@/lib/prisma'
import { updateTag } from 'next/cache'

export async function saveSubcategoryAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = subcategorySchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Check subcategory data.',
    }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = {
    categoryId: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    displayOrder: parsed.data.displayOrder,
    isPublished: parsed.data.isPublished,
  }

  try {
    if (parsed.data.id) {
      // 1. First we fetch the existing subcategory to see the old categoryId (for the cache)
      const existingSubcategory = await prisma.subcategory.findUnique({
        where: { id: parsed.data.id },
        select: { categoryId: true },
      })

      // 2. We update the subcategory
      await prisma.subcategory.update({
        where: { id: parsed.data.id },
        data,
      })

      // 3. We AUTOMATICALLY update all menuItems belonging to this subcategory
      await prisma.menuItem.updateMany({
        where: { subcategoryId: parsed.data.id },
        data: { categoryId: parsed.data.categoryId },
      })

      // Revalidation for the old category if it has changed
      if (
        existingSubcategory &&
        existingSubcategory.categoryId !== parsed.data.categoryId
      ) {
        updateTag(`menu-items-${existingSubcategory.categoryId}`)
      }
    } else {
      await prisma.subcategory.create({ data })
    }

    // Cache revalidation
    updateTag('categories')
    updateTag('subcategories')
    updateTag('menu-items')

    if (parsed.data.categoryId) {
      updateTag(`menu-items-${parsed.data.categoryId}`)
    }

    return { success: true, message: 'The subcategory has been saved.' }
  } catch (error) {
    console.error('Error saving subcategory:', error)
    return {
      success: false,
      message: 'An error occurred while saving the subcategory.',
    }
  }
}

export async function deleteSubcategoryAction(
  id: string,
): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const used = await prisma.menuItem.count({ where: { subcategoryId: id } })

  if (used) {
    return {
      success: false,
      message: 'Move or delete items from this subcategory first.',
    }
  }

  const subcategory = await prisma.subcategory.findUnique({
    where: { id },
    select: { categoryId: true },
  })

  if (!subcategory) {
    return {
      success: false,
      message: 'The subcategory does not exist.',
    }
  }

  try {
    await prisma.subcategory.delete({ where: { id } })

    updateTag('categories')
    updateTag('subcategories')
    updateTag(`menu-items-${subcategory.categoryId}`)

    return { success: true, message: 'Subcategory has been deleted.' }
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the subcategory.',
    }
  }
}
