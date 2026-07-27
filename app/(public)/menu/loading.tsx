import MenuCategoriesSkeleton from '@/components/Menu/MenuCategoriesSkeleton'
import MenuGridSkeleton from '@/components/Menu/skeletons/MenuGridSkeleton'

export default function Loading() {
  return (
    <main className='flex-1 px-4 py-20 sm:px-8 lg:px-12 w-full max-w-7xl mx-auto'>
      <div className='my-8 space-y-3'>
        <div className='h-10 w-64 max-w-full animate-pulse rounded bg-surface-container sm:h-12 sm:w-80' />
        <div className='h-4 w-full max-w-2xl animate-pulse rounded bg-surface-container' />
        <div className='h-4 w-3/4 max-w-xl animate-pulse rounded bg-surface-container' />
      </div>

      <MenuCategoriesSkeleton />
      <MenuGridSkeleton count={8} />
    </main>
  )
}
