import { ReservationsSkeleton } from '@/components/Reservations/ReservationsSkeleton'

export default function ProfileReservationsLoading() {
  return (
    <main className='min-h-screen w-full grow animate-pulse bg-surface pt-16'>
      <section className='border-b border-border/20 bg-background px-6 py-12 md:px-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-5'>
          <div className='h-4 w-36 rounded bg-muted' />
          <div className='h-12 w-80 rounded bg-muted' />
          <div className='h-4 w-96 max-w-full rounded bg-muted' />
        </div>
      </section>
      <section className='mx-auto w-full max-w-7xl px-6 py-12 pb-24 md:px-12'>
        <ReservationsSkeleton />
      </section>
    </main>
  )
}
