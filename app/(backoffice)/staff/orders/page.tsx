import { ShoppingBag } from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { OrderStatusActions } from '@/components/backoffice/StatusActionButtons'
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { getStaffOrders } from '@/lib/db/admin.services'
import { formatDeliveryMethod } from '@/lib/utils/order'
import { Role } from '@/lib/generated/prisma'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

export default async function StaffOrdersPage() {
  const user = await requireRouteAccess('/staff/orders')
  const orders = await getStaffOrders()
  const role = user.role as Role

  return (
    <>
      <BackofficeHeader
        eyebrow='Servis'
        title='Предавање нарачки'
        description='Готовите нарачки се предаваат на гостинот или се означуваат како испратени.'
      />
      <div className='grid gap-4 px-6 py-8 md:grid-cols-2 md:px-10 xl:grid-cols-3'>
        {orders.map((order) => (
          <article
            key={order.id}
            className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-6'
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='font-display text-2xl'>#{order.orderNumber}</p>
                <p className='mt-1 text-xs text-on-surface-variant'>
                  {formatBackofficeDateTime(order.updatedAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className='my-5 border-y border-outline-variant/15 py-4 text-sm'>
              <p>{formatDeliveryMethod(order.deliveryMethod)}</p>
              <p className='mt-1 text-on-surface-variant'>
                {order.customerName} · {order.phone}
              </p>
            </div>
            <OrderStatusActions
              orderId={order.id}
              status={order.status}
              deliveryMethod={order.deliveryMethod}
              role={role}
            />
          </article>
        ))}
        {!orders.length ? (
          <div className='col-span-full flex flex-col items-center py-24 text-center text-on-surface-variant'>
            <ShoppingBag className='mb-4 size-10 text-primary' />
            <p>Нема нарачки за предавање.</p>
          </div>
        ) : null}
      </div>
    </>
  )
}
