'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { calculateDeliveryFee } from '@/lib/constants/delivery'
import { DeliveryMethod } from '@/lib/generated/prisma'
import { generateUniqueOrderNumber } from '@/lib/utils/generate-order-number'

// 1. Дефинирање на типови за влезните податоци
export interface CartItemInput {
  menuItemId: string
  quantity: number
  price: number // Цената што му се прикажувала на корисникот во кошничката
}

export interface CreateOrderInput {
  deliveryMethod: DeliveryMethod
  paymentMethod: 'CASH' | 'CARD'
  phone: string
  deliveryAddress?: string
  notes?: string
  items: CartItemInput[]
}

// 2. Типови за грешки при проверка
export interface ItemIssue {
  menuItemId: string
  name: string
  reason: 'PRICE_CHANGED' | 'ITEM_UNAVAILABLE'
  message: string
  oldPrice?: number
  newPrice?: number
}

export interface CreateOrderResponse {
  success: boolean
  message: string
  orderId?: string
  orderNumber?: string
  issues?: ItemIssue[]
}

export async function createOrder(
  data: CreateOrderInput,
): Promise<CreateOrderResponse> {
  try {
    // A. Автентикација преку Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user?.id) {
      return {
        success: false,
        message: 'Мора да бидете најавени за да направите нарачка.',
      }
    }

    const userId = session.user.id
    const customerName = session.user.name || 'Анонимен'

    // B. Основни валидации на формата
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: 'Вашата кошничка е празна.',
      }
    }

    if (!data.phone || !data.phone.trim()) {
      return {
        success: false,
        message: 'Ве молиме внесете телефонски број за контакт.',
      }
    }

    if (
      data.deliveryMethod === 'ADDRESS' &&
      (!data.deliveryAddress || !data.deliveryAddress.trim())
    ) {
      return {
        success: false,
        message: 'Ве молиме внесете адреса за достава.',
      }
    }

    // C. Извлекување на најновите податоци за артиклите од базата
    const itemIds = data.items.map((item) => item.menuItemId)
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    })

    const dbItemsMap = new Map(dbMenuItems.map((item) => [item.id, item]))
    const issues: ItemIssue[] = []

    let calculatedSubtotal = 0

    // D. Проверка на секој артикл (дали постои и дали цената е иста)
    for (const clientItem of data.items) {
      const dbItem = dbItemsMap.get(clientItem.menuItemId)

      // 1. Проверка дали артиклот е избришан/не постои
      if (!dbItem) {
        issues.push({
          menuItemId: clientItem.menuItemId,
          name: 'Непознат артикл',
          reason: 'ITEM_UNAVAILABLE',
          message: 'Артиклот повеќе не е достапен во менито.',
        })
        continue
      }

      // 2. Проверка за промена на цена
      if (dbItem.price !== clientItem.price) {
        issues.push({
          menuItemId: dbItem.id,
          name: dbItem.name,
          reason: 'PRICE_CHANGED',
          message: `Цената за "${dbItem.name}" е променета од ${clientItem.price} ден. на ${dbItem.price} ден.`,
          oldPrice: clientItem.price,
          newPrice: dbItem.price,
        })
      }

      // Пресметка со вистинската цена од базата
      calculatedSubtotal += dbItem.price * clientItem.quantity
    }

    // E. Доколку има каква било разлика, ја прекинуваме нарачката
    if (issues.length > 0) {
      return {
        success: false,
        message:
          'Настанаа измени во менито или цените. Ве молиме прегледајте ги известувањата.',
        issues,
      }
    }

    // F. Пресметување достава и тотал
    const deliveryFee = calculateDeliveryFee(
      calculatedSubtotal,
      data.deliveryMethod,
    )
    const finalTotal = calculatedSubtotal + deliveryFee
    const orderNumber = await generateUniqueOrderNumber('LM')

    // G. Креирање на нарачката во базата
    const newOrder = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        customerName,
        phone: data.phone,
        deliveryAddress:
          data.deliveryMethod === 'ADDRESS' ? data.deliveryAddress : null,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        subtotal: calculatedSubtotal,
        deliveryFee,
        total: finalTotal,
        notes: data.notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: data.items.map((item) => {
            const dbItem = dbItemsMap.get(item.menuItemId)!
            return {
              menuItemId: item.menuItemId,
              name: dbItem.name,
              price: dbItem.price,
              quantity: item.quantity,
            }
          }),
        },
      },
    })

    return {
      success: true,
      message: 'Нарачката е успешно креирана!',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
    }
  } catch (error) {
    console.error('Грешка при креирање на нарачка:', error)
    return {
      success: false,
      message:
        'Настана системска грешка. Ве молиме обидете се повторно подоцна.',
    }
  }
}
