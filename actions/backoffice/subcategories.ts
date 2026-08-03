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
      message: 'Проверете ги податоците за подкатегоријата.',
    }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const data = {
    categoryId: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    displayOrder: parsed.data.displayOrder,
  }

  try {
    if (parsed.data.id) {
      await prisma.subcategory.update({
        where: { id: parsed.data.id },
        data,
      })
    } else {
      await prisma.subcategory.create({ data })
    }

    updateTag('categories')
    updateTag('subcategories')
    updateTag('menu-items')

    if (parsed.data.categoryId) {
      updateTag(`menu-items-${parsed.data.categoryId}`)
    }

    return { success: true, message: 'Подкатегоријата е зачувана.' }
  } catch (error) {
    console.error('Грешка при зачувување подкатегорија:', error)
    return {
      success: false,
      message: 'Се појави грешка при зачувување на подкатегоријата.',
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
      message:
        'Прво преместете ги или избришете ги артиклите од оваа подкатегорија.',
    }
  }

  const subcategory = await prisma.subcategory.findUnique({
    where: { id },
    select: { categoryId: true },
  })

  if (!subcategory) {
    return {
      success: false,
      message: 'Подкатегоријата не постои.',
    }
  }

  try {
    await prisma.subcategory.delete({ where: { id } })

    updateTag('categories')
    updateTag('subcategories')
    updateTag(`menu-items-${subcategory.categoryId}`)

    return { success: true, message: 'Подкатегоријата е избришана.' }
  } catch (error) {
    console.error('Грешка при бришење подкатегорија:', error)
    return {
      success: false,
      message: 'Се појави грешка при бришење на подкатегоријата.',
    }
  }
}
