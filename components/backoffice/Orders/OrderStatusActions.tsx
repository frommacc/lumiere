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
//   CONFIRMED: 'Confirm',
//   PREPARING: 'Start',
//   READY: 'Done',
//   IN_TRANSIT: 'Send',
//   DELIVERED: 'Delivered',
//   CANCELED: 'Cancel',
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
  CONFIRMED: 'Confirm',
  PREPARING: 'Get started',
  READY: 'Done',
  IN_TRANSIT: 'Send',
  CANCELLED: 'Give up',
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

  // Dynamic label determination based on shipping method
  const getStatusLabel = (nextStatus: OrderStatus) => {
    if (nextStatus === OrderStatus.DELIVERED) {
      return deliveryMethod === DeliveryMethod.PICKUP
        ? 'Raised'
        : 'Delivered'
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
