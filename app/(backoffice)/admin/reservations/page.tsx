import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { requireRouteAccess } from '@/lib/authorization'
import { getReservationDateKey } from '@/lib/reservations'
import { Role } from '@/lib/generated/prisma'

import { ReservationsTabs } from '@/components/backoffice/Reservations/ReservationsTabs'
import {
  getAgendaReservationsForDate,
  getAllPendingReservations,
} from '@/lib/db/backoffice/reservations.services'

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; tab?: string }>}) {
  const user = await requireRouteAccess('/admin/reservations')
  const params = await searchParams

  const date = params.date || getReservationDateKey(new Date())
  const role = user.role as Role

  // Load the data in parallel
  const [pendingReservations, agendaReservations] = await Promise.all([
    getAllPendingReservations(),
    getAgendaReservationsForDate(date),
  ])

  return (
    <>
      <BackofficeHeader
        eyebrow='Operative'
        title='Reservations'
        description='Management of new requests and daily agenda.'
      />

      <div className='px-6 py-8 md:px-10'>
        <ReservationsTabs
          pendingReservations={pendingReservations}
          agendaReservations={agendaReservations}
          role={role}
          currentDate={date}
        />
      </div>
    </>
  )
}
