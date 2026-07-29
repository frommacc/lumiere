'use server'

import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { categorySchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'
import { prisma } from '@/lib/prisma'
import { updateTag } from 'next/cache'

import { handleImageUpload } from '@/lib/manage-image-upload'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'

export async function saveCategoryAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input)

  if (!parsed.success)
    return {
      success: false,
      message: 'Проверете ги податоците за категоријата.',
    }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  // 1. Земање на постоечките податоци ако е Edit
  let existingCategory = null
  if (parsed.data.id) {
    existingCategory = await prisma.category.findUnique({
      where: { id: parsed.data.id },
    })
  }

  // 2. Upload на новата слика (ако има)
  const { image, imageId, cleanupOldImage } = await handleImageUpload({
    newFile: parsed.data.imageFile,
    currentImage: existingCategory?.image,
    currentImageId: existingCategory?.imageId,
    folder: 'categories',
  })

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image: image ?? '',
    imageId,
    displayOrder: parsed.data.displayOrder,
  }

  try {
    // 3. ПРВО СНИМАЊЕ ВО БАЗА
    if (parsed.data.id) {
      await prisma.category.update({ where: { id: parsed.data.id }, data })
    } else {
      await prisma.category.create({ data })
    }

    await cleanupOldImage()

    updateTag('categories')
    updateTag('menu-items')

    return { success: true, message: 'Категоријата е зачувана.' }
  } catch (error) {
    console.error('Грешка при зачувување во база:', error)

    return {
      success: false,
      message: 'Се појави грешка при зачувување на категоријата.',
    }
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  // 1. Проверка дали категоријата се користи во мени артикли
  const used = await prisma.menuItem.count({ where: { categoryId: id } })

  if (used)
    return {
      success: false,
      message:
        'Прво преместете ги или избришете ги артиклите од оваа категорија.',
    }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { imageId: true },
  })

  if (!category) {
    return {
      success: false,
      message: 'Категоријата не е пронајдена.',
    }
  }

  await prisma.category.delete({ where: { id } })

  if (category.imageId) {
    await deleteImageFromCloudinary(category.imageId).catch((err) => {
      console.error('Грешка при бришење слика од Cloudinary:', err)
    })
  }

  updateTag('categories')
  updateTag('menu-items')

  return { success: true, message: 'Категоријата е избришана.' }
}
