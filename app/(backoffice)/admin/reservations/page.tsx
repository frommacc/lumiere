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
  searchParams: Promise<{ date?: string; tab?: string }>
}) {
  const user = await requireRouteAccess('/admin/reservations')
  const params = await searchParams

  const date = params.date || getReservationDateKey(new Date())
  const role = user.role as Role

  // Паралелно вчитување на податоците
  const [pendingReservations, agendaReservations] = await Promise.all([
    getAllPendingReservations(),
    getAgendaReservationsForDate(date),
  ])

  return (
    <>
      <BackofficeHeader
        eyebrow='Оператива'
        title='Резервации'
        description='Управување со нови барања и дневна агенда.'
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
