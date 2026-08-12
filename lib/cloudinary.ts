import { v2 as cloudinary } from 'cloudinary'
import { optimizeImage } from './image-optimizer'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImagesToCloudinary(
  files: File[],
  folder: string = 'general',
) {
  const uploadPromises = files.map(async (file) => {
    if (file.size === 0) return null

    const arrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)

    // --- THIS IS WHERE THE MAGIC HAPPENS ---
    // We optimize the image before upload. By default we make it max 1200px width in WebP.
    const optimizedBuffer = await optimizeImage(originalBuffer, 1200)

    return new Promise<{ url: string; imageId: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
            format: 'webp',
          },
          (error, result) => {
            if (error) reject(error)
            else
              resolve({
                url: result!.secure_url,
                imageId: result!.public_id,
              })
          },
        )
        .end(optimizedBuffer)
    })
  })

  const results = await Promise.all(uploadPromises)

  return results.filter(
    (img): img is { url: string; imageId: string } => img !== null,
  )
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary Delete Error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}
