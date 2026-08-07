'use client'

import { useState, useEffect, useRef } from 'react'
import { OrderStatus } from '@/lib/generated/prisma'
import { pusherClient } from '@/lib/pusher'
import { KdsOrder } from '@/components/backoffice/Kitchen/KdsOrderCard'

const KITCHEN_STATUSES: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
]

export function useKdsOrders(
  initialOrders: KdsOrder[],
  onNewConfirmedOrder?: () => void,
) {
  const [orders, setOrders] = useState<KdsOrder[]>(initialOrders)

  // 1. Ref за зачувување на callback-от (спречува повторно претплаќање на Pusher)
  const alertRef = useRef(onNewConfirmedOrder)
  useEffect(() => {
    alertRef.current = onNewConfirmedOrder
  }, [onNewConfirmedOrder])

  useEffect(() => {
    const channel = pusherClient.subscribe('kds-channel')

    const handleStatusUpdate = (data: {
      orderId: string
      status: OrderStatus
      updatedOrder?: KdsOrder
    }) => {
      let isNewConfirmedForKitchen = false

      setOrders((prev) => {
        const exists = prev.some((o) => o.id === data.orderId)

        // 1. Ако новиот статус НЕ е за кујна (на пр. станала READY) -> отстрани ја од кујнската табла
        if (!KITCHEN_STATUSES.includes(data.status)) {
          return prev.filter((o) => o.id !== data.orderId)
        }

        // 2. Ако веќе постои во кујната (на пр. преминува од CONFIRMED во PREPARING)
        if (exists) {
          return prev.map((order) =>
            order.id === data.orderId
              ? { ...order, status: data.status }
              : order,
          )
        }

        // 3. Нова нарачка што штотуку ВЛЕГУВА во кујната (Станала CONFIRMED)
        if (data.status === OrderStatus.CONFIRMED) {
          isNewConfirmedForKitchen = true
        }

        if (data.updatedOrder) {
          const formattedNewOrder: KdsOrder = {
            ...data.updatedOrder,
            status: data.status,
            createdAt: new Date(data.updatedOrder.createdAt),
            items: data.updatedOrder.items ?? [],
          }
          return [...prev, formattedNewOrder]
        }

        return prev
      })

      // Свири аларм ТОЧНО кога нарачката станува CONFIRMED
      if (isNewConfirmedForKitchen) {
        alertRef.current?.()
      }
    }

    channel.bind('order-status-updated', handleStatusUpdate)

    return () => {
      channel.unbind('order-status-updated', handleStatusUpdate)
      pusherClient.unsubscribe('kds-channel')
    }
  }, []) // Се претплаќа само еднаш при mount

  const confirmedOrders = orders.filter(
    (o) => o.status === OrderStatus.CONFIRMED,
  )
  const preparingOrders = orders.filter(
    (o) => o.status === OrderStatus.PREPARING,
  )

  return {
    orders,
    confirmedOrders,
    preparingOrders,
  }
}
