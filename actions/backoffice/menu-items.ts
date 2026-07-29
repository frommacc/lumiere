'use server'

import { menuItemSchema } from '@/lib/validations/backoffice'
import { ActionResult, forbidden } from '../utils'
import { getAuthorizedUser } from '@/lib/authorization'
import { MANAGEMENT_ROLES } from '@/lib/constants/access-control'
import { prisma } from '@/lib/prisma'
import { handleImageUpload } from '@/lib/manage-image-upload'
import { updateTag } from 'next/cache'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'

// SAVE MENU ITEM ACTION
export async function saveMenuItemAction(
  input: unknown,
): Promise<ActionResult> {
  const parsed = menuItemSchema.safeParse(input)
  if (!parsed.success)
    return { success: false, message: 'Проверете ги податоците за артиклот.' }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  // 1. Земање на постоечкиот артикал од база (ако се работи за Edit)
  let existingItem = null
  if (parsed.data.id) {
    existingItem = await prisma.menuItem.findUnique({
      where: { id: parsed.data.id },
    })
  }

  // 2. Безбедно ракување со сликата преку helper функцијата
  const { image, imageId, cleanupOldImage } = await handleImageUpload({
    newFile: parsed.data.imageFile,
    currentImage: existingItem?.image,
    currentImageId: existingItem?.imageId,
    folder: 'menu-items', // посебен фолдер во Cloudinary за артикли
  })

  // 3. Подготовка на податоците за Prisma (изземаме imageFile)
  const { id, imageFile, ...itemData } = parsed.data

  const data = {
    ...itemData,
    image: image ?? '',
    imageId: imageId || null,
  }

  try {
    // 4. Зачувување во база
    if (id) {
      await prisma.menuItem.update({
        where: { id },
        data,
      })
    } else {
      await prisma.menuItem.create({ data })
    }

    await cleanupOldImage()

    updateTag('menu-items')
    return { success: true, message: 'Артиклот е зачуван.' }
  } catch (error) {
    console.error('Грешка при зачувување на артиклот:', error)

    return { success: false, message: 'Се појави грешка при зачувување.' }
  }
}

// DELETE MENU ITEM ACTION
export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  // 1. Пронајди го артиклот во база за да го земеш imageId
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: { imageId: true },
  })

  if (!item) {
    return {
      success: false,
      message: 'Артиклот не е пронајден.',
    }
  }

  try {
    // 2. Бришење на артиклот од базата
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

// TOGGLE AVAILABILITY ACTION
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
