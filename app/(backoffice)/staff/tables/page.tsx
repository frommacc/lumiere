import { TableProperties } from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { ReservationStatusBadge } from '@/components/Reservations/ReservationStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { Role } from '@/lib/generated/prisma'
import { formatBackofficeTime } from '@/components/backoffice/formatters'
import { ReservationActions } from '@/components/backoffice/Reservations/ReservationActions'
import { getAdminTables } from '@/lib/db/backoffice/tables.services'

export default async function StaffTablesPage() {
  const user = await requireRouteAccess('/staff/tables')
  const tables = await getAdminTables()
  const role = user.role as Role

  return (
    <>
      <BackofficeHeader
        eyebrow='Servis'
        title='Active tables'
        description='Daily review of tables and guests to be served.'
      />
      <div className='grid gap-4 px-6 py-8 sm:grid-cols-2 md:px-10 xl:grid-cols-3'>
        {tables.map((table) => {
          const reservation = table.reservations[0]
          return (
            <article
              key={table.id}
              className={`rounded-xl border p-5 ${reservation ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/20 bg-surface-container-low/40'}`}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <p className='font-display text-3xl'>{table.number}</p>
                  <p className='mt-1 text-xs text-on-surface-variant'>                    {table.tableType.name} · {table.capacity} seats
                  </p>
                </div>
                {reservation ? (
                  <ReservationStatusBadge status={reservation.status} />
                ) : (
                  <span className='rounded-full bg-surface-container-high px-3 py-1 text-[10px] uppercase tracking-widest text-on-surface-variant'>                    Free
                  </span>
                )}
              </div>
              {reservation ? (
                <div className='mt-6 space-y-4 border-t border-primary/20 pt-4'>
                  <div>
                    <p className='font-medium'>                      {reservation.name} · {reservation.guests} guests
                    </p>
                    <p className='mt-1 text-xs text-on-surface-variant'>
                      {formatBackofficeTime(reservation.startTime)} –{' '}
                      {formatBackofficeTime(reservation.endTime)}
                    </p>
                  </div>
                  <ReservationActions
                    reservationId={reservation.id}
                    status={reservation.status}
                    role={role}
                  />
                </div>
              ) : (
                <p className='mt-6 border-t border-outline-variant/15 pt-4 text-sm text-on-surface-variant'>                  No active booking.
                </p>
              )}
            </article>
          )
        })}
        {!tables.length ? (
          <div className='col-span-full flex flex-col items-center py-24 text-center text-on-surface-variant'>
            <TableProperties className='mb-4 size-10 text-primary' />
            <p>No tables have been created yet.</p>
          </div>
        ) : null}
      </div>
    </>
  )
}
