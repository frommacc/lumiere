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
      message: 'Check category data.',
    }

  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  // 1. Fetching existing data if Edit
  let existingCategory = null
  if (parsed.data.id) {
    existingCategory = await prisma.category.findUnique({
      where: { id: parsed.data.id },
    })
  }

  // 2. Upload the new image (if any)
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
    isPublished: parsed.data.isPublished,
  }

  try {
    // 3. FIRST RECORDING IN THE BASE
    if (parsed.data.id) {
      await prisma.category.update({ where: { id: parsed.data.id }, data })
    } else {
      await prisma.category.create({ data })
    }

    await cleanupOldImage()

    updateTag('categories')
    updateTag('menu-items')

    if (parsed.data.id) {
      updateTag(`menu-items-${parsed.data.id}`)
    }

    return { success: true, message: 'The category has been saved.' }
  } catch (error) {
    console.error('Error saving to database:', error)

    return {
      success: false,
      message: 'An error occurred while saving the category.',
    }
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!(await getAuthorizedUser([...MANAGEMENT_ROLES]))) return forbidden()

  const subcategoriesCount = await prisma.subcategory.count({
    where: { categoryId: id },
  })

  if (subcategoriesCount > 0) {
    return {
      success: false,
      message: 'First delete or move all subcategories of this category.',
    }
  }

  // 1. Checking if the category is used in menu items
  const used = await prisma.menuItem.count({ where: { categoryId: id } })

  if (used)
    return {
      success: false,
      message: 'Move or delete items from this category first.',
    }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true, imageId: true },
  })

  if (!category) {
    return {
      success: false,
      message: 'Category not found.',
    }
  }

  await prisma.category.delete({ where: { id } })

  if (category.imageId) {
    await deleteImageFromCloudinary(category.imageId).catch((err) => {
      console.error('Error deleting image from Cloudinary:', err)
    })
  }

  updateTag('categories')
  updateTag('menu-items')

  if (category.id) {
    updateTag(`menu-items-${category.id}`)
  }

  return { success: true, message: 'The category has been deleted.' }
}
