import { Skeleton } from '@/components/ui/skeleton'

export function BackofficeLoading() {
  return (
    <div className='animate-pulse'>
      <header className='border-b border-outline-variant/15 px-6 py-8 md:px-10'>
        <Skeleton className='h-3 w-32 bg-primary/15' />
        <Skeleton className='mt-4 h-10 w-64 bg-surface-container-high' />
        <Skeleton className='mt-3 h-4 w-full max-w-xl bg-surface-container-high' />
      </header>
      <div className='grid gap-5 px-6 py-8 md:grid-cols-3 md:px-10'>
        {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className='h-52 rounded-xl bg-surface-container-low' />)}
      </div>
    </div>
  )
}
