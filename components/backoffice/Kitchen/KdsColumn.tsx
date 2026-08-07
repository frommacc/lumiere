import { ReactNode } from 'react'
import { KdsOrder, KdsOrderCard } from './KdsOrderCard'
import { Role } from '@/lib/generated/prisma'

interface KdsColumnProps {
  title: string
  count: number
  iconIndicator: ReactNode
  orders: KdsOrder[]
  role: Role
}

export function KdsColumn({
  title,
  count,
  iconIndicator,
  orders,
  role,
}: KdsColumnProps) {
  return (
    <div className='relative flex w-100 shrink-0 flex-col gap-4'>
      {/* Sticky Header */}
      <div className='sticky top-0 z-20 flex items-center justify-between bg-background/90 py-4 backdrop-blur-md'>
        <div className='flex items-center gap-3'>
          {iconIndicator}
          <h2 className='font-heading text-lg font-bold uppercase tracking-wide text-foreground'>
            {title}
          </h2>
        </div>
        <span className='rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-foreground shadow-sm'>
          {count}
        </span>
      </div>

      {/* Orders List */}
      <div className='flex flex-col gap-4'>
        {orders.map((order) => (
          <KdsOrderCard key={order.id} order={order} role={role} />
        ))}
      </div>
    </div>
  )
}
