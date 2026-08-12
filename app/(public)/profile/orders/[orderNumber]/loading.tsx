export default function OrderLoading() {
  return (
    <main className='min-h-screen w-full bg-background text-foreground py-16 animate-pulse'>
      {/* 1. OrderHeader Skeleton */}
      <section className='relative w-full py-12 md:py-16 px-6 md:px-12 bg-background border-b border-border/20 overflow-hidden'>
        <div className='relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6'>
          <div className='flex flex-col gap-2 w-full md:w-auto'>            {/* Back Link */}
            <div className='h-4 w-36 bg-muted rounded mb-4' />            {/* Small title */}
            <div className='h-3 w-32 bg-muted rounded' />            {/* Order number */}
            <div className='h-10 md:h-12 w-48 bg-muted rounded mt-1' />            {/* Date and Time */}
            <div className='flex items-center gap-4 mt-2'>
              <div className='h-4 w-28 bg-muted rounded' />
              <div className='h-4 w-20 bg-muted rounded' />
            </div>
          </div>          {/* Status Badge */}
          <div className='h-10 w-36 bg-muted rounded-full' />
        </div>
      </section>

      {/* 2. OrderStatusTracker Skeleton */}
      <section className='w-full py-12 px-6 md:px-12 bg-card border-b border-border/20'>
        <div className='max-w-4xl mx-auto'>
          <div className='relative flex items-center justify-between'>
            {/* Background Line */}
            <div className='absolute top-1/2 left-0 w-full h-0.5 bg-border/40 -translate-y-1/2 z-0' />

            {/* 4 Stekogashi (Circles & Labels) */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='relative z-10 flex flex-col items-center gap-3 bg-card px-2'
              >
                <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted' />
                <div className='h-3 w-16 bg-muted rounded' />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className='w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>          {/* Left Column: OrderItemsList Skeleton */}
          <div className='lg:col-span-7 flex flex-col'>            {/* Title: Your Choice */}
            <div className='h-6 w-40 bg-muted rounded mb-6 border-b border-border/20 pb-4' />            {/* Items (3 dummy item) */}
            <div className='flex flex-col divide-y divide-border/20'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='py-6 flex items-center gap-6'>                  {/* Image */}
                  <div className='w-20 h-20 md:w-24 md:h-24 rounded-md bg-muted shrink-0' />                  {/* Name and Description */}
                  <div className='grow space-y-2'>
                    <div className='h-5 w-3/4 bg-muted rounded' />
                    <div className='h-3 w-1/2 bg-muted rounded' />
                  </div>                  {/* Quantity and Price */}
                  <div className='flex flex-col items-end gap-2 shrink-0'>
                    <div className='h-3 w-16 bg-muted rounded' />
                    <div className='h-5 w-20 bg-muted rounded' />
                  </div>
                </div>
              ))}
            </div>
          </div>          {/* Right Column: OrderDeliveryCard & OrderSummaryCard Skeleton */}
          <div className='lg:col-span-5 flex flex-col gap-6'>
            {/* 3. OrderDeliveryCard Skeleton */}
            <div className='bg-card p-6 md:p-8 rounded-lg border border-border/30 relative overflow-hidden space-y-6'>
              <div className='absolute top-0 left-0 w-1 h-full bg-muted' />
              <div className='h-3 w-40 bg-muted rounded mb-6' />

              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex gap-3 items-start'>
                  <div className='w-5 h-5 rounded bg-muted shrink-0' />
                  <div className='space-y-1.5 grow'>
                    <div className='h-2.5 w-20 bg-muted rounded' />
                    <div className='h-4 w-3/4 bg-muted rounded' />
                  </div>
                </div>
              ))}
            </div>

            {/* 4. OrderSummaryCard Skeleton */}
            <div className='bg-card p-6 md:p-8 rounded-lg border border-border/30 space-y-4'>
              <div className='h-3 w-36 bg-muted rounded mb-6' />

              <div className='flex justify-between items-center'>
                <div className='h-4 w-20 bg-muted rounded' />
                <div className='h-4 w-16 bg-muted rounded' />
              </div>

              <div className='flex justify-between items-center'>
                <div className='h-4 w-20 bg-muted rounded' />
                <div className='h-4 w-12 bg-muted rounded' />
              </div>

              <div className='pt-4 mt-4 border-t border-border/30 flex justify-between items-center'>
                <div className='h-6 w-24 bg-muted rounded' />
                <div className='h-6 w-24 bg-muted rounded' />
              </div>
            </div>
          </div>
        </div>

        {/* 5. OrderMap Skeleton */}
        <div className='w-full h-90 md:h-100 mt-12 rounded-lg bg-muted border border-border/30' />
      </section>
    </main>
  )
}
