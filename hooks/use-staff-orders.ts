'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { DeliveryMethod, OrderStatus } from '@/lib/generated/prisma'
import { pusherClient } from '@/lib/pusher'
import { KdsOrder } from '@/components/backoffice/Kitchen/KdsOrderCard'

const STAFF_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.READY,
  OrderStatus.IN_TRANSIT,
]

export function useStaffOrders(
  initialOrders: KdsOrder[],
  onNewOrderAlert?: () => void,
) {
  const [orders, setOrders] = useState<KdsOrder[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')

  // 1. We store the callback in a ref so that we don't re-subscribe the Pusher on every render
  const alertRef = useRef(onNewOrderAlert)
  useEffect(() => {
    alertRef.current = onNewOrderAlert
  }, [onNewOrderAlert])

  useEffect(() => {
    const channel = pusherClient.subscribe('kds-channel')

    // 1. Brand new online order listener
    const handleNewOrder = (newOrder: KdsOrder) => {
      if (STAFF_STATUSES.includes(newOrder.status)) {
        const formattedOrder: KdsOrder = {
          ...newOrder,
          createdAt: new Date(newOrder.createdAt),
          items: newOrder.items ?? [],
        }

        let isNew = false
        setOrders((prev) => {
          if (prev.some((o) => o.id === formattedOrder.id)) return prev
          isNew = true
          return [...prev, formattedOrder]
        })

        // We call the alarm ONCE, not inside setOrders
        if (isNew) {
          alertRef.current?.()
        }
      }
    }

    // 2. Status update listener
    const handleStatusUpdate = (data: {
      orderId: string
      status: OrderStatus
      updatedOrder?: KdsOrder
    }) => {
      let shouldAlert = false

      setOrders((prev) => {
        const exists = prev.some((o) => o.id === data.orderId)

        // Remove from board if new status is out of range
        if (!STAFF_STATUSES.includes(data.status)) {
          return prev.filter((o) => o.id !== data.orderId)
        }

        // Update the status if it already exists
        if (exists) {
          return prev.map((o) =>
            o.id === data.orderId ? { ...o, status: data.status } : o,
          )
        }

        // New order for this board (e.g. READY has been set by the kitchen)
        if (data.updatedOrder) {
          shouldAlert = true
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

      if (shouldAlert) {
        alertRef.current?.()
      }
    }

    channel.bind('new-order-created', handleNewOrder)
    channel.bind('order-status-updated', handleStatusUpdate)

    return () => {
      channel.unbind('new-order-created', handleNewOrder)
      channel.unbind('order-status-updated', handleStatusUpdate)
      pusherClient.unsubscribe('kds-channel')
    }
  }, []) // Empty dependency array - Pusher channel is subscribed only once!

  // Search and filter
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return orders

    return orders.filter((o) => {
      const customerName = o.customerName?.toLowerCase() || ''
      const phone = o.phone || ''
      const orderId = o.id.toLowerCase()
      const orderNumber = o.orderNumber ? String(o.orderNumber) : ''
      const address = o.deliveryAddress?.toLowerCase() || ''

      return (
        customerName.includes(query) ||
        phone.includes(query) ||
        orderId.includes(query) ||
        orderNumber.includes(query) ||
        address.includes(query)
      )
    })
  }, [orders, searchQuery])

  // Split by columns
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === OrderStatus.PENDING,
  )
  const pickupReadyOrders = filteredOrders.filter(
    (o) =>
      o.deliveryMethod === DeliveryMethod.PICKUP &&
      o.status === OrderStatus.READY,
  )
  const deliveryReadyOrders = filteredOrders.filter(
    (o) =>
      o.deliveryMethod === DeliveryMethod.ADDRESS &&
      o.status === OrderStatus.READY,
  )
  const inTransitOrders = filteredOrders.filter(
    (o) =>
      o.deliveryMethod === DeliveryMethod.ADDRESS &&
      o.status === OrderStatus.IN_TRANSIT,
  )

  return {
    orders,
    filteredOrders,
    searchQuery,
    setSearchQuery,
    pendingOrders,
    pickupReadyOrders,
    deliveryReadyOrders,
    inTransitOrders,
  }
}
