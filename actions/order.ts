'use server'

import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { calculateDeliveryFee } from '@/lib/constants/delivery'
import { DeliveryMethod } from '@/lib/generated/prisma'
import { generateUniqueOrderNumber } from '@/lib/utils/generate-order-number'
import { pusherServer } from '@/lib/pusher'

// 1. Defining input data types
export interface CartItemInput {
  menuItemId: string
  quantity: number
  price: number // The price that was displayed to the user in the shopping cart
}

export interface CreateOrderInput {
  deliveryMethod: DeliveryMethod
  paymentMethod: 'CASH' | 'CARD'
  phone: string
  deliveryAddress?: string
  latitude?: number | null
  longitude?: number | null
  notes?: string
  items: CartItemInput[]
}

// 2. Types of checking errors
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
    // A. Authentication through Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user?.id) {
      return {
        success: false,
        message: 'You must be logged in to place an order.',
      }
    }

    const userId = session.user.id
    const customerName = session.user.name || 'Anonymous'

    // B. Basic form validations
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty.',
      }
    }

    if (!data.phone || !data.phone.trim()) {
      return {
        success: false,
        message: 'Please enter a contact phone number.',
      }
    }

    if (
      data.deliveryMethod === 'ADDRESS' &&
      (!data.deliveryAddress || !data.deliveryAddress.trim())
    ) {
      return {
        success: false,
        message: 'Please enter a shipping address.',
      }
    }

    // C. Retrieving the latest item data from the database
    const itemIds = data.items.map((item) => item.menuItemId)
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
      },
    })

    const dbItemsMap = new Map(dbMenuItems.map((item) => [item.id, item]))
    const issues: ItemIssue[] = []

    let calculatedSubtotal = 0

    // D. Checking each item (if it exists and if the price is the same)
    for (const clientItem of data.items) {
      const dbItem = dbItemsMap.get(clientItem.menuItemId)

      // 1. Checking if the item has been deleted/does not exist
      if (!dbItem) {
        issues.push({
          menuItemId: clientItem.menuItemId,
          name: 'Unknown item',
          reason: 'ITEM_UNAVAILABLE',
          message: 'The item is no longer available in the menu.',
        })
        continue
      }

      if (!dbItem.isAvailable) {
        issues.push({
          menuItemId: dbItem.id,
          name: dbItem.name,
          reason: 'ITEM_UNAVAILABLE',
          message: `The item "${dbItem.name}" is currently out of stock.`,
        })
        continue
      }

      // 2. Check for a price change
      if (dbItem.price !== clientItem.price) {
        issues.push({
          menuItemId: dbItem.id,
          name: dbItem.name,
          reason: 'PRICE_CHANGED',
          message: `The price for "${dbItem.name}" has changed from ${clientItem.price} to ${dbItem.price}.`,
          oldPrice: clientItem.price,
          newPrice: dbItem.price,
        })
      }

      // Calculation with the actual price from the base
      calculatedSubtotal += dbItem.price * clientItem.quantity
    }

    // E. If there is any difference, we cancel the order
    if (issues.length > 0) {
      return {
        success: false,
        message:
          'There have been changes to the menu or prices. Please review your cart.',
        issues,
      }
    }

    // F. Calculation of delivery and total
    const deliveryFee = calculateDeliveryFee(
      calculatedSubtotal,
      data.deliveryMethod,
    )
    const finalTotal = calculatedSubtotal + deliveryFee
    const orderNumber = await generateUniqueOrderNumber('LM')

    // G. Creating the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        customerName,
        phone: data.phone,
        deliveryAddress:
          data.deliveryMethod === 'ADDRESS' ? data.deliveryAddress : null,
        latitude: data.latitude,
        longitude: data.longitude,
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
      include: {
        items: true,
      },
    })

    // PUSHER TRIGGER
    await pusherServer.trigger('kds-channel', 'new-order-created', newOrder)

    return {
      success: true,
      message: 'Order successfully created!',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      message: 'A system error has occurred. Please try again later.',
    }
  }
}
