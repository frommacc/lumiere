import sharp from 'sharp'

/**
 * Helper function for image optimization, resizing and compression.
 * @param buffer The original image buffer
 * @param maxWidth Maximum width (default 1200px)
 * @returns Optimized Buffer in WebP format
 */
export async function optimizeImage(
  buffer: Buffer,
  maxWidth: number = 1200,
): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .rotate()
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toBuffer()
  } catch (error) {
    console.error('Sharp image optimization error:', error)

    return buffer
  }
}
