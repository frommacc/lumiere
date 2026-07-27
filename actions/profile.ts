'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import {
  getUserProfileImage,
  updateProfileUser,
} from '@/lib/db/users.services'
import {
  deleteImageFromCloudinary,
  uploadImagesToCloudinary,
} from '@/lib/cloudinary'
import { editProfileSchema } from '@/lib/validations/profile'

export type UpdateProfileResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> }

export async function updateProfileAction(
  formData: FormData,
): Promise<UpdateProfileResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return {
      success: false,
      message: 'Мора да бидете најавени за да го уредите профилот.',
    }
  }

  const imageEntry = formData.get('image')
  const image = imageEntry instanceof File && imageEntry.size > 0
    ? imageEntry
    : undefined

  const parsed = editProfileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    image,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Проверете ги внесените податоци и обидете се повторно.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  let uploadedImage: { url: string; imageId: string } | undefined

  try {
    const currentImage = await getUserProfileImage(session.user.id)

    if (parsed.data.image) {
      ;[uploadedImage] = await uploadImagesToCloudinary(
        [parsed.data.image],
        'restaurant/users',
      )
    }

    await updateProfileUser(session.user.id, {
      name: parsed.data.name,
      phone: parsed.data.phone,
      ...(uploadedImage && {
        image: uploadedImage.url,
        imageId: uploadedImage.imageId,
      }),
    })

    if (uploadedImage && currentImage?.imageId) {
      try {
        await deleteImageFromCloudinary(currentImage.imageId)
      } catch {
        console.error('Неуспешно бришење на претходната профилна слика.')
      }
    }

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Профилот е успешно ажуриран.',
    }
  } catch (error) {
    if (uploadedImage) {
      try {
        await deleteImageFromCloudinary(uploadedImage.imageId)
      } catch {
        console.error('Неуспешно чистење на ново-поставената профилна слика.')
      }
    }

    console.error('Profile update error:', error)

    return {
      success: false,
      message: 'Не успеавме да го ажурираме профилот. Обидете се повторно.',
    }
  }
}
