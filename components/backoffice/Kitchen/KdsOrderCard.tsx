'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Bike, ShoppingBag, Timer } from 'lucide-react'
import {
  DeliveryMethod,
  OrderStatus,
  PaymentStatus,
  Role,
} from '@/lib/generated/prisma'
import { OrderStatusActions } from '../Orders/OrderStatusActions'

interface KdsItem {
  id: string
  name: string
  quantity: number
}

export interface KdsOrder {
  id: string
  orderNumber: string
  createdAt: Date
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  paymentStatus: PaymentStatus
  customerName?: string | null
  notes?: string | null
  items: KdsItem[]
  phone?: string | null
  deliveryAddress?: string | null
}

interface KdsOrderCardProps {
  order: KdsOrder
  role: Role
}

export function KdsOrderCard({ order, role }: KdsOrderCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const startMs = new Date(order.createdAt).getTime()
    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((Date.now() - startMs) / 1000))
      setElapsedSeconds(diff)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [order.createdAt])

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const isPreparing = order.status === OrderStatus.PREPARING
  const isDelayed = elapsedSeconds > 1200 // > 20 min

  return (
    <div
      className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
        isDelayed
          ? 'border border-destructive/40 bg-surface-container animate-pulse'
          : isPreparing
            ? 'border border-primary/30 bg-surface-container'
            : 'bg-surface-container'
      }`}
    >
      {/* Dynamic Top Bar */}
      <div
        className={`absolute top-0 left-0 h-0.75 w-full ${
          isDelayed
            ? 'bg-destructive'
            : isPreparing
              ? 'bg-primary'
              : 'bg-muted-foreground/30'
        }`}
      />

      {/* Card Header */}
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <span
            className={`font-heading text-xl font-bold ${
              isDelayed
                ? 'text-destructive'
                : isPreparing
                  ? 'text-primary'
                  : 'text-foreground'
            }`}
          >
            #{order.orderNumber}
          </span>
          <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
            {order.deliveryMethod === DeliveryMethod.ADDRESS ? (
              <>
                <Bike className='size-3.5' />
                <span>ДОСТАВА</span>
              </>
            ) : (
              <>
                <ShoppingBag className='size-3.5 text-primary' />
                <span className='text-primary'>ПОДИГНУВАЊЕ</span>
              </>
            )}
            {order.paymentStatus === PaymentStatus.PAID && (
              <span className='text-primary'>• ПЛАТЕНО</span>
            )}
          </div>
        </div>

        {/* Live Timer */}
        <div
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 shadow-sm backdrop-blur-sm ${
            isDelayed
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : isPreparing
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-outline-variant/30 bg-surface-container-high text-foreground'
          }`}
        >
          <Timer className='size-3.5' />
          <span className='font-mono text-base font-bold tabular-nums'>
            {formatTimer(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className='flex flex-col gap-3'>
        {(order.items ?? []).map((item, index) => (
          <div key={item.id} className='flex flex-col gap-3'>
            <div className='flex items-start gap-3'>
              <span className='font-heading text-lg font-bold text-primary'>
                {item.quantity}x
              </span>
              <span className='text-base font-semibold text-foreground'>
                {item.name}
              </span>
            </div>
            {index < order.items.length - 1 && (
              <div className='h-px w-full border-b border-dotted border-outline-variant/20' />
            )}
          </div>
        ))}
      </div>

      {/* Allergies / Notes */}
      {order.notes && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive shadow-sm'>
          <AlertTriangle className='mt-0.5 size-4 shrink-0' />
          <div className='flex flex-col'>
            <span className='text-[10px] font-bold uppercase tracking-wider'>
              БЕЛЕШКА / АЛЕРГИЈА
            </span>
            <span className='text-xs leading-snug text-destructive-foreground'>
              {order.notes}
            </span>
          </div>
        </div>
      )}

      {/* Card Footer & Action Buttons */}
      <div className='mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-4'>
        <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
          {order.customerName || 'ГОСТИН'}
        </span>
        <OrderStatusActions
          orderId={order.id}
          status={order.status}
          deliveryMethod={order.deliveryMethod}
          role={role}
        />
      </div>
    </div>
  )
}
