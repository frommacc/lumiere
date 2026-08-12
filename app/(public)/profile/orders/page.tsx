import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { OrderFilters } from '@/components/Orders/OrderFilters'
import { OrdersContent } from '@/components/Orders/OrdersContent'
import { OrdersSkeleton } from '@/components/Orders/OrdersSkeleton'

interface PageProps {
  searchParams: Promise<{ q?: string; limit?: string }>
}

export default async function ProfileOrdersPage({ searchParams }: PageProps) {
  return (
    <main className='grow pt-16 w-full bg-surface min-h-screen'>
      <section className='relative w-full py-12 md:py-24 px-6 md:px-12 bg-background border-b border-border/20 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/orders-page-bg.webp'
            alt='Orders Background'
            fill
            priority
            className='object-cover object-center opacity-25'
          />

          <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/30' />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div className='space-y-4'>
            <Link
              href='/profile'
              className='flex items-center gap-2 group text-outline hover:text-primary transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='font-label-caps text-label-caps uppercase'>                Back to Profile
              </span>
            </Link>
            <h1 className='font-mono text-5xl font-bold text-surface-foreground'>              History of <span className='text-primary italic'>Orders</span>
            </h1>
          </div>

          <OrderFilters />
        </div>

        <div className='absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none' />
      </section>

      <div className='flex flex-col w-full max-w-7xl mx-auto px-margin-desktop py-12 pb-24'>
        <Suspense
          key={JSON.stringify(await searchParams)}
          fallback={<OrdersSkeleton />}
        >
          <OrdersContent searchParams={searchParams} />
        </Suspense>
      </div>

      {/* Ambient Decorative Blur */}
      <div className='fixed top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none select-none -z-10' />
      <div className='fixed bottom-1/4 -left-24 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none select-none -z-10' />
    </main>
  )
}
