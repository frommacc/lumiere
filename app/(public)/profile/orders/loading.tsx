import { OrdersSkeleton } from '@/components/Orders/OrdersSkeleton'

export default function OrdersLoading() {
  return (
    <main className='grow pt-16 w-full bg-surface min-h-screen animate-pulse'>
      {/* Header Skeleton */}
      <section className='relative w-full py-12 md:py-24 px-6 md:px-12 bg-background border-b border-border/20 overflow-hidden'>
        <div className='relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6'>          {/* Left Side: Back Button and Title */}
          <div className='space-y-4 w-full md:w-auto'>            {/* Back to Profile */}
            <div className='h-4 w-36 bg-muted rounded' />            {/* Order History */}
            <div className='h-10 md:h-12 w-64 md:w-80 bg-muted rounded' />
          </div>          {/* Right side: OrderFilters Skeleton */}
          <div className='w-full sm:w-80 h-10 bg-muted/50 rounded-none border-b border-outline-variant/50' />
        </div>
      </section>      {/* List of orders - we use your already defined component */}
      <div className='flex flex-col w-full max-w-7xl mx-auto px-margin-desktop py-12 pb-24'>
        <OrdersSkeleton />
      </div>

      {/* Ambient Decorative Blur */}
      <div className='fixed top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none select-none -z-10' />
      <div className='fixed bottom-1/4 -left-24 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none select-none -z-10' />
    </main>
  )
}
