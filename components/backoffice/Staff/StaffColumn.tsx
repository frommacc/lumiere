import { ReactNode } from 'react'
import { KdsOrder, KdsOrderCard } from '../Kitchen/KdsOrderCard'
import { Role } from '@/lib/generated/prisma'

interface StaffColumnProps {
  title: string
  count: number
  iconIndicator: ReactNode
  orders: KdsOrder[]
  role: Role
}

export function StaffColumn({
  title,
  count,
  iconIndicator,
  orders,
  role,
}: StaffColumnProps) {
  return (
    <div className='relative flex w-full flex-col gap-4 md:w-100 md:shrink-0'>
      {/* Sticky / Header */}
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
      </div>      {/* Orders List:
          - Mobile: flex-row, overflow-x-auto, snap-x for scroll carousel
          - Desktop (md:): flex-col, overflow-x-visible
      */}
      <div className='flex flex-row snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:flex-col md:overflow-x-visible md:pb-0'>
        {orders.map((order) => (
          <div
            key={order.id}
            className='w-[85vw] shrink-0 snap-center sm:w-[360px] md:w-full'
          >
            <KdsOrderCard order={order} role={role} />
          </div>
        ))}
      </div>
    </div>
  )
}
