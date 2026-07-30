import { Role } from '@/lib/generated/prisma'
import { formatBackofficeTime } from '@/components/backoffice/formatters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReservationActions } from './ReservationActions'
import { AdminReservation } from './ReservationsTable'

interface PendingReservationsTableProps {
  reservations: AdminReservation[]
  role: Role
}

export function PendingReservationsTable({
  reservations,
  role,
}: PendingReservationsTableProps) {
  if (!reservations.length) {
    return (
      <div className='rounded-xl border border-dashed border-outline-variant/25 bg-surface-container-low/20 p-8 text-center text-sm text-on-surface-variant'>
        Нема нови барања за резервација за овој ден.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs'>
      <Table className='min-w-230'>
        <TableHeader className='border-b border-amber-500/20 text-[10px] uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='px-5 py-3.5'>Време / Гост</TableHead>
            <TableHead className='px-5 py-3.5'>Маса</TableHead>
            <TableHead className='px-5 py-3.5'>Контакт</TableHead>
            <TableHead className='px-5 py-3.5'>Брза акција</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-amber-500/15'>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              className='hover:bg-amber-500/10 transition-colors'
            >
              <TableCell className='px-5 py-4'>
                <div className='flex items-center gap-3.5'>
                  <div className='flex flex-col items-center justify-center rounded-lg border border-amber-500/40 bg-background px-2.5 py-1.5 shadow-xs'>
                    <span className='font-mono text-xl font-bold text-on-surface'>
                      {formatBackofficeTime(reservation.startTime)}
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold text-on-surface text-sm'>
                      {reservation.name}
                    </p>
                    <p className='text-xs text-on-surface-variant'>
                      {reservation.guests}{' '}
                      {reservation.guests === 1 ? 'гост' : 'гости'} ·{' '}
                      {reservation.durationMinutes} мин.
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className='px-5 py-4'>
                <div className='flex items-baseline gap-1.5'>
                  <span className='font-bold text-on-surface text-base'>
                    #{reservation.table.number}
                  </span>
                  <span className='rounded-md bg-background px-2 py-0.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/20'>
                    {reservation.table.tableType.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className='px-5 py-4'>
                <p className='font-medium text-xs text-on-surface'>
                  {reservation.phone}
                </p>
                <p className='text-xs text-on-surface-variant'>
                  {reservation.email}
                </p>
              </TableCell>

              <TableCell className='px-5 py-4'>
                <ReservationActions
                  reservationId={reservation.id}
                  status={reservation.status}
                  role={role}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
