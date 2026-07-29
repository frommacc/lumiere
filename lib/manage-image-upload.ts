import {
  deleteImageFromCloudinary,
  uploadImagesToCloudinary,
} from './cloudinary'

interface ManageImageOptions {
  newFile?: File | null
  currentImage?: string | null
  currentImageId?: string | null
  folder?: string
}

interface ImageUploadResult {
  image: string | null
  imageId: string | null
  /** Повикај ја оваа функција САМО по успешно зачувување во базата */
  cleanupOldImage: () => Promise<void>
}

export async function handleImageUpload({
  newFile,
  currentImage = null,
  currentImageId = null,
  folder = 'general',
}: ManageImageOptions): Promise<ImageUploadResult> {
  // Празен cleanup по подразбирање
  const noopCleanup = async () => {}

  // Ако нема Нов фајл, врати ги постарите податоци и празен cleanup
  if (!newFile || !(newFile instanceof File) || newFile.size === 0) {
    return {
      image: currentImage,
      imageId: currentImageId,
      cleanupOldImage: noopCleanup,
    }
  }

  // 1. Upload на новата слика
  const uploadResults = await uploadImagesToCloudinary([newFile], folder)

  if (uploadResults.length === 0) {
    return {
      image: currentImage,
      imageId: currentImageId,
      cleanupOldImage: noopCleanup,
    }
  }

  const newImageData = uploadResults[0]

  // 2. Дефинирање на cleanup функцијата за старата слика
  const cleanupOldImage = async () => {
    if (currentImageId) {
      await deleteImageFromCloudinary(currentImageId).catch((err) => {
        console.error('Грешка при бришење на стара слика од Cloudinary:', err)
      })
    }
  }

  // Забележи: ТЕК ТУКА НЕ ја бришеме старата слика веднаш!
  return {
    image: newImageData.url,
    imageId: newImageData.imageId,
    cleanupOldImage,
  }
}
