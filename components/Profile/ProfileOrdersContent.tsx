import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowRight, ReceiptText } from 'lucide-react'

import { auth } from '@/lib/auth'
import { OrderCard } from '@/components/Orders/OrderCard'
import {
  getRecentUserOrders,
  getUserOrderStats,
} from '@/lib/db/orders.services'
import { Price } from '../shared/Price'

export async function ProfileOrdersContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login?redirect_url=/profile')
  }

  const [recentOrders, orderStats] = await Promise.all([
    getRecentUserOrders(session.user.id),
    getUserOrderStats(session.user.id),
  ])

  const orderCount = orderStats._count.id
  const totalSpent = orderStats._sum.total ?? 0

  return (
    <section className='px-6 md:px-12 pb-32'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-end justify-between gap-6 mb-8'>
          <div>
            <span className='font-label-caps text-[10px] text-primary tracking-[0.3em] uppercase mb-2 block'>
              {' '}
              Your history
            </span>
            <h2 className='font-display text-3xl md:text-4xl text-on-surface'>
              {' '}
              Last orders
            </h2>
          </div>
          <Link
            href='/profile/orders'
            className='hidden sm:flex group items-center gap-3 font-label-caps text-[11px] text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase'
          >
            {' '}
            See them all
            <ArrowRight className='size-4 text-primary group-hover:translate-x-1 transition-transform' />
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
          <Metric label='Orders' value={String(orderCount)} />
          <Metric label='Spent'>
            <Price amount={totalSpent} className='font-normal' />
          </Metric>
        </div>

        {recentOrders.length > 0 ? (
          <div className='flex flex-col gap-6'>
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className='border border-dashed border-outline-variant/30 px-6 py-16 flex flex-col items-center text-center'>
            <ReceiptText className='size-12 text-primary mb-5' />
            <h3 className='font-display text-2xl text-on-surface'>
              You have no orders yet
            </h3>
            <p className='mt-2 max-w-md text-sm text-on-surface-variant'>
              {' '}
              When you place an order, it will appear here with all its status
              and details.
            </p>
            <Link
              href='/menu'
              className='mt-6 px-8 py-3 bg-primary text-primary-foreground font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary-container transition-colors'
            >
              {' '}
              Look at the menu
            </Link>
          </div>
        )}

        <div className='mt-10 flex justify-center sm:hidden'>
          <Link
            href='/profile/orders'
            className='inline-flex items-center gap-3 px-8 py-3 bg-primary text-primary-foreground font-label-caps text-[11px] tracking-widest uppercase'
          >
            {' '}
            See all orders
            <ArrowRight className='size-4' />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Metric({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className='p-6 bg-surface-container-low/40 border border-outline-variant/10 rounded-xl'>
      <p className='font-label-caps text-[10px] text-outline tracking-widest uppercase mb-2'>
        {label}
      </p>
      <p className='font-display text-2xl text-primary wrap-break-word'>
        {value ? value : children}
      </p>
    </div>
  )
}
