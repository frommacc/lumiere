import sharp from 'sharp'

/**
 * Хелпер функција за оптимизација, промена на големина и компресија на слика.
 * @param buffer Оригиналниот бафер на сликата
 * @param maxWidth Максимална ширина (стандардно 1200px)
 * @returns Оптимизиран Buffer во WebP формат
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
    console.error('Грешка при оптимизација на сликата со sharp:', error)

    return buffer
  }
}
