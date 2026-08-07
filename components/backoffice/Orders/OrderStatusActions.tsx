// 'use client'

// import { useTransition } from 'react'
// import { Check, LoaderCircle, X } from 'lucide-react'
// import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'

// import { Button } from '@/components/ui/button'
// import { getAllowedOrderStatuses } from '@/lib/constants/operational-status'
// import { DeliveryMethod, OrderStatus, Role } from '@/lib/generated/prisma'
// import { updateOrderStatusAction } from '@/actions/backoffice/orders'

// const orderLabels: Partial<Record<OrderStatus, string>> = {
//   CONFIRMED: 'Потврди',
//   PREPARING: 'Започни',
//   READY: 'Готово',
//   IN_TRANSIT: 'Испрати',
//   DELIVERED: 'Испорачано',
//   CANCELLED: 'Откажи',
// }

// export function OrderStatusActions({
//   orderId,
//   status,
//   deliveryMethod,
//   role,
// }: {
//   orderId: string
//   status: OrderStatus
//   deliveryMethod: DeliveryMethod
//   role: Role
// }) {
//   const [pending, startTransition] = useTransition()
//   const router = useRouter()
//   const nextStatuses = getAllowedOrderStatuses(role, status, deliveryMethod)
//   if (!nextStatuses.length) return null

//   const update = (nextStatus: OrderStatus) =>
//     startTransition(async () => {
//       const result = await updateOrderStatusAction({
//         orderId,
//         status: nextStatus,
//       })
//       if (result.success) toast.success(result.message)
//       else toast.error(result.message)
//       if (result.success) router.refresh()
//     })

//   return (
//     <div className='flex flex-wrap gap-2'>
//       {nextStatuses.map((nextStatus) => (
//         <Button
//           key={nextStatus}
//           type='button'
//           size='sm'
//           disabled={pending}
//           variant={nextStatus === OrderStatus.CANCELLED ? 'outline' : 'default'}
//           className={
//             nextStatus === OrderStatus.CANCELLED
//               ? 'border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive'
//               : ''
//           }
//           onClick={() => update(nextStatus)}
//         >
//           {pending ? (
//             <LoaderCircle className='size-3.5 animate-spin' />
//           ) : nextStatus === OrderStatus.CANCELLED ? (
//             <X className='size-3.5' />
//           ) : (
//             <Check className='size-3.5' />
//           )}
//           {orderLabels[nextStatus] ?? nextStatus}
//         </Button>
//       ))}
//     </div>
//   )
// }

'use client'

import { useTransition } from 'react'
import { Check, LoaderCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { getAllowedOrderStatuses } from '@/lib/constants/operational-status'
import { DeliveryMethod, OrderStatus, Role } from '@/lib/generated/prisma'
import { updateOrderStatusAction } from '@/actions/backoffice/orders'

const baseOrderLabels: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: 'Потврди',
  PREPARING: 'Започни',
  READY: 'Готово',
  IN_TRANSIT: 'Испрати',
  CANCELLED: 'Откажи',
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

  // Динамичко одредување на етикетата врз основа на методот на испорака
  const getStatusLabel = (nextStatus: OrderStatus) => {
    if (nextStatus === OrderStatus.DELIVERED) {
      return deliveryMethod === DeliveryMethod.PICKUP
        ? 'Подигната'
        : 'Доставена'
    }
    return baseOrderLabels[nextStatus] ?? nextStatus
  }

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
          {getStatusLabel(nextStatus)}
        </Button>
      ))}
    </div>
  )
}
