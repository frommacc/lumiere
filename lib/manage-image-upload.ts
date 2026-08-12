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
  /** Call this function ONLY after a successful database save */
  cleanupOldImage: () => Promise<void>
}

export async function handleImageUpload({
  newFile,
  currentImage = null,
  currentImageId = null,
  folder = 'general',
}: ManageImageOptions): Promise<ImageUploadResult> {
  // Empty cleanup by default
  const noopCleanup = async () => {}

  // If there is no New file, restore older data and empty cleanup
  if (!newFile || !(newFile instanceof File) || newFile.size === 0) {
    return {
      image: currentImage,
      imageId: currentImageId,
      cleanupOldImage: noopCleanup,
    }
  }

  // 1. Upload the new image
  const uploadResults = await uploadImagesToCloudinary([newFile], folder)

  if (uploadResults.length === 0) {
    return {
      image: currentImage,
      imageId: currentImageId,
      cleanupOldImage: noopCleanup,
    }
  }

  const newImageData = uploadResults[0]

  // 2. Defining the cleanup function for the old image
  const cleanupOldImage = async () => {
    if (currentImageId) {
      await deleteImageFromCloudinary(currentImageId).catch((err) => {
        console.error('Error deleting old image from Cloudinary:', err)
      })
    }
  }

  // Note: ONLY HERE we do NOT delete the old image immediately!
  return {
    image: newImageData.url,
    imageId: newImageData.imageId,
    cleanupOldImage,
  }
}
