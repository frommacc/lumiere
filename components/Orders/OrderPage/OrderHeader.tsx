import Image from 'next/image'
import { OrderStatus } from '@/lib/generated/prisma'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface OrderHeaderProps {
  orderNumber: string
  createdAt: Date
  status: OrderStatus
}

export function OrderHeader({
  orderNumber,
  createdAt,
  status,
}: OrderHeaderProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(createdAt)

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdAt)

  return (
    <section className='relative w-full py-12 md:py-16 px-6 md:px-12 bg-background border-b border-border/20 overflow-hidden'>      {/* Background image with Overlay for good contrast */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/order-page-bg.jpg'
          alt='Order Background'
          fill
          priority
          className='object-cover object-center opacity-25'
        />        {/* Gradient for a smooth transition to the background */}
        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/30' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6'>
        <div className='flex flex-col gap-2'>
          <Link
            href='/profile/orders'
            className='mb-4 flex items-center gap-2 group text-outline hover:text-primary transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-label-caps text-label-caps uppercase'>              Back to Orders
            </span>
          </Link>
          <span className='text-xs font-semibold text-primary uppercase tracking-[0.3em]'>            Order details
          </span>
          <h1 className='text-3xl md:text-5xl font-bold text-foreground'>
            #{orderNumber}
          </h1>
          <div className='flex items-center gap-4 mt-2 text-muted-foreground text-sm'>
            <span className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
              {formattedDate}
            </span>
            <span className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4 text-muted-foreground' />              {formattedTime} h.
            </span>
          </div>
        </div>

        <div className='flex flex-col items-start md:items-end'>
          <div className='bg-primary/10 border border-primary/30 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-3'>
            <span className='relative flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-primary'></span>
            </span>
            <span className='text-xs font-semibold text-primary uppercase tracking-wider'>              { status === OrderStatus.CANCELLED
                ? 'cancelled'
                : 'Active Order'}
            </span>
          </div>
        </div>
      </div>

      <div className='absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none' />
    </section>
  )
}
