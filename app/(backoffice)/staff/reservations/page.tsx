import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { ReservationStatusBadge } from '@/components/Reservations/ReservationStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { Role } from '@/lib/generated/prisma'
import { formatBackofficeTime } from '@/components/backoffice/formatters'
import { getStaffReservations } from '@/lib/db/reservations.services'
import { ReservationActions } from '@/components/backoffice/Reservations/ReservationActions'

export default async function StaffReservationsPage() {
  const user = await requireRouteAccess('/staff/reservations')
  const reservations = await getStaffReservations()
  const role = user.role as Role
  return (
    <>
      <BackofficeHeader
        eyebrow='Servis'
        title="Today's bookings"
        description='Confirmed guests can be marked as seated, completed or no-show'
      />
      <div className='space-y-3 px-6 py-8 md:px-10'>
        {reservations.map((reservation) => (
          <article
            key={reservation.id}
            className='flex flex-col gap-5 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-5 lg:flex-row lg:items-center lg:justify-between'
          >
            <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
              <div>
                <p className='font-display text-xl'>
                  {formatBackofficeTime(reservation.startTime)}
                </p>
                <p className='mt-1 text-xs text-on-surface-variant'>                  {reservation.durationMinutes} min.
                </p>
              </div>
              <div>
                <p className='font-medium'>                  {reservation.name} · {reservation.guests} guests
                </p>
                <p className='mt-1 text-xs text-on-surface-variant'>
                  {reservation.table.number} ·{' '}
                  {reservation.table.tableType.name} · {reservation.phone}
                </p>
              </div>
              <ReservationStatusBadge status={reservation.status} />
            </div>
            <ReservationActions
              reservationId={reservation.id}
              status={reservation.status}
              role={role}
            />
          </article>
        ))}
        {!reservations.length ? (
          <p className='py-24 text-center text-sm text-on-surface-variant'>            There are no reservations for today.
          </p>
        ) : null}
      </div>
    </>
  )
}
