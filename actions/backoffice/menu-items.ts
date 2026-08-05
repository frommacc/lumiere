'use server'

import { menuItemSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'
import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { prisma } from '@/lib/prisma'
import { handleImageUpload } from '@/lib/manage-image-upload'
import { updateTag } from 'next/cache'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'

export async function saveMenuItemAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = menuItemSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: 'Проверете ги податоците за артиклот.' }
  }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  let existingItem = null
  if (parsed.data.id) {
    existingItem = await prisma.menuItem.findUnique({
      where: { id: parsed.data.id },
    })
  }

  const { image, imageId, cleanupOldImage } = await handleImageUpload({
    newFile: parsed.data.imageFile,
    currentImage: existingItem?.image,
    currentImageId: existingItem?.imageId,
    folder: 'menu-items',
  })

  const { id, imageFile, categoryId, subcategoryId, ...itemData } = parsed.data

  // 1. Утврдување на subcategoryId
  const finalSubcategoryId =
    subcategoryId && subcategoryId !== 'none' ? subcategoryId : null

  let finalCategoryId = categoryId || null

  if (finalSubcategoryId) {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: finalSubcategoryId },
      select: { categoryId: true },
    })
    if (subcategory) {
      finalCategoryId = subcategory.categoryId
    }
  }

  const data = {
    ...itemData,
    categoryId: finalCategoryId,
    subcategoryId: finalSubcategoryId,
    image: image ?? '',
    imageId: imageId || null,
  }

  try {
    if (id) {
      await prisma.menuItem.update({
        where: { id },
        data,
      })
    } else {
      await prisma.menuItem.create({ data })
    }

    await cleanupOldImage()

    // Кеш ревалидација
    updateTag('menu-items')
    if (finalCategoryId) {
      updateTag(`menu-items-${finalCategoryId}`)
    }
    // Зачистување кеш и за претходната категорија доколку е сменета
    if (
      existingItem?.categoryId &&
      existingItem.categoryId !== finalCategoryId
    ) {
      updateTag(`menu-items-${existingItem.categoryId}`)
    }

    return { success: true, message: 'Артиклот е зачуван.' }
  } catch (error) {
    console.error('Грешка при зачувување на артиклот:', error)
    return { success: false, message: 'Се појави грешка при зачувување.' }
  }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: { imageId: true },
  })

  if (!item) {
    return { success: false, message: 'Артиклот не е пронајден.' }
  }

  try {
    await prisma.menuItem.delete({ where: { id } })

    if (item.imageId) {
      await deleteImageFromCloudinary(item.imageId).catch((err) => {
        console.error('Грешка при бришење слика од Cloudinary:', err)
      })
    }

    updateTag('menu-items')
    return { success: true, message: 'Артиклот е избришан.' }
  } catch (error) {
    console.error('Грешка при бришење артикал:', error)
    return {
      success: false,
      message:
        'Артиклот не може да се избрише бидејќи е веќе поврзан со нарачки.',
    }
  }
}

export async function toggleMenuItemAvailabilityAction(
  itemId: string,
  isAvailable: boolean,
): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()
  await prisma.menuItem.update({
    where: { id: itemId },
    data: { isAvailable },
  })
  updateTag('menu-items')
  return {
    success: true,
    message: isAvailable
      ? 'Артиклот е објавен.'
      : 'Артиклот е повлечен од менито.',
  }
}
