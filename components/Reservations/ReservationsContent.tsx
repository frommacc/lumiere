import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { getUserReservations } from '@/lib/db/reservations.services'
import { EmptyReservationsState } from './EmptyReservationsState'
import { LoadMoreReservations } from './LoadMoreReservations'
import { ReservationsList } from './ReservationsList'

export async function ReservationsContent({
  searchParams,
}: {
  searchParams: Promise<{ limit?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login?redirect_url=/profile/reservations')

  const { limit: rawLimit } = await searchParams
  const limit = Math.min(Math.max(Number(rawLimit) || 10, 1), 100)
  const { reservations, hasMore } = await getUserReservations({
    userId: session.user.id,
    limit,
  })

  if (!reservations.length) return <EmptyReservationsState />

  return (
    <>
      <ReservationsList reservations={reservations} />
      <LoadMoreReservations currentLimit={limit} hasMore={hasMore} />
    </>
  )
}
