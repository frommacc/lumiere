import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'

import { ReservationsContent } from '@/components/Reservations/ReservationsContent'
import { ReservationsSkeleton } from '@/components/Reservations/ReservationsSkeleton'

interface ProfileReservationsPageProps {
  searchParams: Promise<{ limit?: string }>
}

export default function ProfileReservationsPage({
  searchParams,
}: ProfileReservationsPageProps) {
  return (
    <main className='min-h-screen w-full grow bg-surface pt-16'>
      <section className='relative overflow-hidden border-b border-border/20 bg-background px-6 py-12 md:px-12 md:py-20'>
        <div className='pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-[120px]' />
        <div className='relative mx-auto max-w-7xl space-y-5'>
          <Link
            href='/profile'
            className='group flex w-fit items-center gap-2 text-outline transition-colors hover:text-primary'
          >
            <ArrowLeft className='size-5' />
            <span className='font-label-caps text-label-caps uppercase'>Назад кон профил</span>
          </Link>

          <div className='flex items-center gap-4'>
            <CalendarDays className='size-10 text-primary md:size-12' />
            <div>
              <p className='font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary'>Lumière профил</p>
              <h1 className='font-mono text-4xl font-bold text-surface-foreground md:text-5xl'>
                Мои <span className='italic text-primary'>Резервации</span>
              </h1>
            </div>
          </div>
          <p className='max-w-2xl text-sm text-on-surface-variant'>
            Следете го статусот и деталите за сите ваши барања за резервација.
          </p>
        </div>
      </section>

      <section className='mx-auto w-full max-w-7xl px-6 py-12 pb-24 md:px-12'>
        <Suspense key='reservations' fallback={<ReservationsSkeleton />}>
          <ReservationsContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  )
}
