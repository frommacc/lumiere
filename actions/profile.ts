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
      message: 'You must be logged in to edit your profile.',
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
      message: 'Check the entered data and try again.',
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
        console.error('Failed to delete previous profile picture.')
      }
    }

    revalidatePath('/profile')

    return {
      success: true,
      message: 'Profile updated successfully.',
    }
  } catch (error) {
    if (uploadedImage) {
      try {
        await deleteImageFromCloudinary(uploadedImage.imageId)
      } catch {
        console.error('Failed to clear newly uploaded profile picture.')
      }
    }

    console.error('Profile update error:', error)

    return {
      success: false,
      message: 'We were unable to update the profile. Try again.',
    }
  }
}
