import { ChefHat } from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { OrderStatusActions } from '@/components/backoffice/StatusActionButtons'
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { Role } from '@/lib/generated/prisma'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'
import { getKitchenOrders } from '@/lib/db/backoffice/orders.services'

export default async function KitchenOrdersPage() {
  const user = await requireRouteAccess('/kitchen/orders')
  const orders = await getKitchenOrders()
  const role = user.role as Role
  return (
    <>
      <BackofficeHeader
        eyebrow='Кујна / шанк'
        title='Кујнски екран'
        description='Фокусиран редослед за потврдени и активни нарачки.'
      />
      <div className='grid gap-5 px-6 py-8 md:grid-cols-2 md:px-10 2xl:grid-cols-3'>
        {orders.map((order) => (
          <article
            key={order.id}
            className={`rounded-xl border p-6 ${order.status === 'PREPARING' ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/20 bg-surface-container-low/40'}`}
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='font-display text-2xl'>#{order.orderNumber}</p>
                <p className='mt-1 text-xs text-on-surface-variant'>
                  {formatBackofficeDateTime(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <ul className='my-6 space-y-2 border-y border-outline-variant/15 py-4 text-sm'>
              {order.items.map((item) => (
                <li key={item.id} className='flex justify-between gap-4'>
                  <span>{item.name}</span>
                  <span className='font-medium text-primary'>
                    ×{item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            {order.notes ? (
              <p className='mb-5 rounded-md bg-surface-container-high p-3 text-xs text-on-surface-variant'>
                {order.notes}
              </p>
            ) : null}
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
            <ChefHat className='mb-4 size-10 text-primary' />
            <p>Нема активни нарачки во кујна.</p>
          </div>
        ) : null}
      </div>
    </>
  )
}
