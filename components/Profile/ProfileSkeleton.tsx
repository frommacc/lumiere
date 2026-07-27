export function ProfileSkeleton() {
  return (
    <main className='grow pt-16 w-full bg-surface min-h-screen animate-pulse'>
      <ProfileUserSkeleton />
      <ProfileOrdersSkeleton />
    </main>
  )
}

export function ProfileUserSkeleton() {
  return (
    <section aria-busy='true' aria-label='Се вчитува профилот'>
      <section className='relative isolate mb-12 w-full overflow-hidden border-y border-primary/10 bg-linear-to-br from-surface-container via-surface to-surface-container-high/80 px-6 py-16 md:mb-16 md:px-12'>
        <div className='absolute inset-0 pointer-events-none bg-linear-to-br from-primary/10 via-transparent to-tertiary/10' />
        <div className='absolute -left-1/4 top-0 h-full w-2/3 -skew-x-12 bg-linear-to-r from-primary/10 to-transparent blur-3xl pointer-events-none' />
        <div className='absolute inset-0 opacity-20 pointer-events-none'>
          <div className='absolute top-0 left-1/4 size-96 rounded-full bg-primary/10 blur-[120px]' />
          <div className='absolute bottom-0 right-1/4 size-96 rounded-full bg-tertiary/5 blur-[120px]' />
        </div>
        <div className='absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface/90 to-transparent pointer-events-none' />

        <div className='relative z-10 flex flex-col items-center justify-center text-center'>
          <div className='relative mb-8'>
            <div className='absolute -inset-1 rounded-full bg-primary/15 blur-md' />
            <Skeleton className='relative size-40 rounded-full border border-primary/20 bg-surface-container-high md:size-56' />
            <Skeleton className='absolute bottom-4 right-0 h-7 w-20 rounded-full bg-primary/30' />
          </div>
          <Skeleton className='h-10 w-64 max-w-[80vw] rounded-md bg-surface-container-high md:h-14' />
          <Skeleton className='mt-4 h-3 w-36 rounded bg-surface-container' />
          <Skeleton className='mt-6 h-10 w-36 rounded-md bg-primary/20' />
        </div>
      </section>

      <section className='mb-24 px-6 md:px-12'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <div className='lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-xl border border-outline-variant/10 bg-surface-container-low/40'>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='space-y-3'>
                <Skeleton className='h-3 w-24 rounded bg-surface-container-high' />
                <Skeleton className={`${index === 1 ? 'w-52 max-w-full' : 'w-44'} h-5 rounded bg-surface-container-high`} />
              </div>
            ))}

            <div className='md:col-span-2 flex flex-col gap-4 border-t border-outline-variant/15 pt-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3'>
                <Skeleton className='size-8 shrink-0 rounded-full bg-primary/15' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-40 bg-surface-container-high' />
                  <Skeleton className='h-3 w-64 max-w-[55vw] bg-surface-container-high' />
                </div>
              </div>
              <Skeleton className='h-8 w-36 bg-primary/15' />
            </div>
          </div>

          <div className='lg:col-span-4 min-h-64 rounded-xl border border-primary/20 bg-linear-to-br from-surface-container-highest to-surface-container p-8 md:p-10'>
            <Skeleton className='h-3 w-28 bg-primary/15' />
            <Skeleton className='mt-3 h-7 w-52 bg-surface-container-high' />
            <div className='mt-10 border-t border-outline-variant/20 pt-6 space-y-3'>
              <Skeleton className='h-4 w-full bg-surface-container-high' />
              <Skeleton className='h-4 w-2/3 bg-surface-container-high' />
              <Skeleton className='mt-6 h-10 w-48 bg-primary/15' />
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pb-24 md:px-12'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 via-surface-container-low to-tertiary/10 px-7 py-7 sm:flex-row sm:items-center sm:justify-between md:px-10'>
          <div className='flex items-start gap-4'>
            <Skeleton className='size-11 shrink-0 rounded-full bg-primary/15' />
            <div className='space-y-3'>
              <Skeleton className='h-3 w-28 bg-primary/15' />
              <Skeleton className='h-7 w-64 max-w-[58vw] bg-surface-container-high' />
              <Skeleton className='h-4 w-80 max-w-[65vw] bg-surface-container-high' />
            </div>
          </div>
          <Skeleton className='h-10 w-36 bg-primary/25' />
        </div>
      </section>
    </section>
  )
}

export function ProfileOrdersSkeleton() {
  return (
    <section className='px-6 md:px-12 pb-32 animate-pulse'>
      <div className='max-w-7xl mx-auto space-y-6'>
        <div className='h-8 w-56 rounded bg-surface-container-high' />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='h-28 rounded-xl bg-surface-container-low/40 border border-outline-variant/10' />
          <div className='h-28 rounded-xl bg-surface-container-low/40 border border-outline-variant/10' />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='h-48 rounded-lg border border-outline-variant/10 bg-surface-container-low/40' />
        ))}
      </div>
    </section>
  )
}
import { Skeleton } from '@/components/ui/skeleton'
