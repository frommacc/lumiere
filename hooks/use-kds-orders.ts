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

  // 1. Ref to save the callback (prevents pusher subscription again)
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

        // 1. If the new status is NOT for a kitchen (eg it became READY) -> remove it from the kitchen board
        if (!KITCHEN_STATUSES.includes(data.status)) {
          return prev.filter((o) => o.id !== data.orderId)
        }

        // 2. If it already exists in the kitchen (eg goes from CONFIRMED to PREPARING)
        if (exists) {
          return prev.map((order) =>
            order.id === data.orderId
              ? { ...order, status: data.status }
              : order,
          )
        }

        // 3. A new order that just ENTERS the kitchen (Becomes CONFIRMED)
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

      // An alarm sounds EXACTLY when an order becomes CONFIRMED
      if (isNewConfirmedForKitchen) {
        alertRef.current?.()
      }
    }

    channel.bind('order-status-updated', handleStatusUpdate)

    return () => {
      channel.unbind('order-status-updated', handleStatusUpdate)
      pusherClient.unsubscribe('kds-channel')
    }
  }, []) // It is subscribed only once at mount

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
