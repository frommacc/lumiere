import { customAlphabet } from 'nanoid'
import { prisma } from '@/lib/prisma'

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

const generateCode = customAlphabet(alphabet, 6)

export async function generateUniqueOrderNumber(
  prefix = 'LM',
): Promise<string> {
  let isUnique = false
  let orderNumber = ''

  while (!isUnique) {
    orderNumber = `${prefix}-${generateCode()}` // Генерира: "LM-8K3P"

    // Обезбедуваме 100% уникатност со проверка во базата
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    })

    if (!existing) {
      isUnique = true
    }
  }

  return orderNumber
}
