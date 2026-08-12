import Link from 'next/link'
import { OrderStatus, Prisma } from '@/lib/generated/prisma'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatCurrency, formatDeliveryMethod } from '@/lib/utils/order'

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true }
}>

interface OrderCardProps {
  order: OrderWithItems
}

export function OrderCard({ order }: OrderCardProps) {
  const isCompleted = order.status === OrderStatus.DELIVERED

  const itemsSummary = order.items
    .map(
      (item) =>
        `${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`,
    )
    .join(', ')

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(order.createdAt))

  return (
    <div
      className={`group relative flex flex-col md:flex-row gap-8 p-8 transition-all hover:bg-surface-container-high/60 ${
        isCompleted
          ? 'bg-transparent border-l border-outline-variant/30 hover:bg-surface-container-low/40'
          : 'bg-surface-container-low/40 backdrop-blur-sm border-l-2 border-primary'
      }`}
    >
      <div className='grow space-y-6'>
        {/* Header Info */}
        <div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
          <OrderStatusBadge status={order.status} />
          <span className='font-label-caps text-label-caps text-outline uppercase tracking-widest'>            No. Order: #{order.orderNumber}
          </span>
          <span className='font-label-caps text-label-caps text-outline uppercase tracking-widest'>
            {formattedDate}
          </span>
        </div>

        {/* Description & Items */}
        <div
          className={`flex flex-col gap-2 ${isCompleted ? 'opacity-80 group-hover:opacity-100 transition-opacity' : ''}`}
        >
          <h3 className='font-headline-sm text-headline-sm text-on-surface'>
            {itemsSummary}
          </h3>
          {order.notes && (
            <p className='font-body-md text-on-surface-variant max-w-2xl italic'>
              „{order.notes}“
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className='flex items-center gap-8 pt-4'>
          <div className='flex flex-col'>
            <span className='font-label-caps text-[10px] text-outline uppercase tracking-tighter'>              In total
            </span>
            <span
              className={`font-headline-sm text-headline-sm ${isCompleted ? 'text-on-surface-variant' : 'text-primary'}`}
            >
              {formatCurrency(order.total)}
            </span>
          </div>
          <div className='h-10 w-px bg-outline-variant/30'></div>
          <div className='flex flex-col'>
            <span className='font-label-caps text-[10px] text-outline uppercase tracking-tighter'>              A way
            </span>
            <span className='font-body-md text-on-surface'>
              {formatDeliveryMethod(order.deliveryMethod)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col justify-end gap-3 min-w-50'>
        <Link
          href={`/profile/orders/${order.orderNumber}`}
          className={`w-full py-4 text-center font-mono text-primary uppercase tracking-widest transition-all ${
            isCompleted
              ? 'border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary duration-300'
              : 'border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground duration-500'
          }`}
        >          Details
        </Link>

        {isCompleted && (
          <button className='w-full py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/10'>            Repeat Order
          </button>
        )}
      </div>
    </div>
  )
}
