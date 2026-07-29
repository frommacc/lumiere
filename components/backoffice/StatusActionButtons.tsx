'use client'

import { useTransition } from 'react'
import { Check, LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  getAllowedOrderStatuses,
  getAllowedReservationStatuses,
} from '@/lib/constants/operational-status'
import {
  DeliveryMethod,
  OrderStatus,
  ReservationStatus,
  Role,
} from '@/lib/generated/prisma'
import { updateOrderStatusAction } from '@/actions/backoffice/orders'
import { updateReservationStatusAction } from '@/actions/backoffice/reservations'

const orderLabels: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: 'Потврди',
  PREPARING: 'Започни',
  READY: 'Готово',
  IN_TRANSIT: 'Испрати',
  DELIVERED: 'Испорачано',
  CANCELLED: 'Откажи',
}

const reservationLabels: Partial<Record<ReservationStatus, string>> = {
  CONFIRMED: 'Потврди',
  SEATED: 'Седнати',
  COMPLETED: 'Заврши',
  CANCELLED: 'Откажи',
  NO_SHOW: 'Не се појави',
}

export function OrderStatusActions({
  orderId,
  status,
  deliveryMethod,
  role,
}: {
  orderId: string
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  role: Role
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const nextStatuses = getAllowedOrderStatuses(role, status, deliveryMethod)
  if (!nextStatuses.length) return null

  const update = (nextStatus: OrderStatus) =>
    startTransition(async () => {
      const result = await updateOrderStatusAction({
        orderId,
        status: nextStatus,
      })
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
      if (result.success) router.refresh()
    })

  return (
    <div className='flex flex-wrap gap-2'>
      {nextStatuses.map((nextStatus) => (
        <Button
          key={nextStatus}
          type='button'
          size='sm'
          disabled={pending}
          variant={nextStatus === OrderStatus.CANCELLED ? 'outline' : 'default'}
          className={
            nextStatus === OrderStatus.CANCELLED
              ? 'border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive'
              : ''
          }
          onClick={() => update(nextStatus)}
        >
          {pending ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : nextStatus === OrderStatus.CANCELLED ? (
            <X className='size-3.5' />
          ) : (
            <Check className='size-3.5' />
          )}
          {orderLabels[nextStatus] ?? nextStatus}
        </Button>
      ))}
    </div>
  )
}

export function ReservationStatusActions({
  reservationId,
  status,
  role,
}: {
  reservationId: string
  status: ReservationStatus
  role: Role
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const nextStatuses = getAllowedReservationStatuses(role, status)
  if (!nextStatuses.length) return null

  const update = (nextStatus: ReservationStatus) =>
    startTransition(async () => {
      const result = await updateReservationStatusAction({
        reservationId,
        status: nextStatus,
      })
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
      if (result.success) router.refresh()
    })

  return (
    <div className='flex flex-wrap gap-2'>
      {nextStatuses.map((nextStatus) => (
        <Button
          key={nextStatus}
          type='button'
          size='sm'
          disabled={pending}
          variant={
            nextStatus === ReservationStatus.CANCELLED ||
            nextStatus === ReservationStatus.NO_SHOW
              ? 'outline'
              : 'default'
          }
          onClick={() => update(nextStatus)}
        >
          {pending ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <Check className='size-3.5' />
          )}
          {reservationLabels[nextStatus] ?? nextStatus}
        </Button>
      ))}
    </div>
  )
}
