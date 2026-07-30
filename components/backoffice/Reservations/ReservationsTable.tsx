import { Role, ReservationStatus } from '@/lib/generated/prisma'
import { ReservationStatusBadge } from '@/components/Reservations/ReservationStatusBadge'
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

export interface AdminReservation {
  id: string
  startTime: Date | string
  name: string
  guests: number
  durationMinutes: number
  phone: string
  email: string
  status: ReservationStatus
  table: {
    number: number | string
    tableType: {
      name: string
    }
  }
}

interface ReservationsTableProps {
  reservations: AdminReservation[]
  role: Role
}

export function ReservationsTable({
  reservations,
  role,
}: ReservationsTableProps) {
  if (!reservations.length) {
    return (
      <div className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-12 text-center text-sm text-on-surface-variant'>
        Нема резервации за овој ден.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40 shadow-sm'>
      <Table className='min-w-230'>
        <TableHeader className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='px-5 py-4'>Време / Гост</TableHead>
            <TableHead className='px-5 py-4'>Маса</TableHead>
            <TableHead className='px-5 py-4'>Контакт</TableHead>
            <TableHead className='px-5 py-4'>Статус</TableHead>
            <TableHead className='px-5 py-4'>Акции</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-outline-variant/10'>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              className='transition-colors hover:bg-surface-container-high/30'
            >
              {/* Време и Гост */}
              <TableCell className='px-5 py-4'>
                <div className='flex items-center gap-3.5'>
                  {/* Модерен Badge за Часот */}
                  <div className='flex flex-col items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high/80 px-2.5 py-1.5 shadow-xs'>
                    <span className='font-mono text-xl font-bold tracking-tight text-on-surface'>
                      {formatBackofficeTime(reservation.startTime)}
                    </span>
                  </div>

                  {/* Информации за Гостинот */}
                  <div className='space-y-0.5'>
                    <p className='font-semibold text-on-surface tracking-wide text-sm'>
                      {reservation.name}
                    </p>
                    <div className='flex items-center gap-1.5 text-xs text-on-surface-variant'>
                      <span className='font-medium text-on-surface/80'>
                        {reservation.guests}{' '}
                        {reservation.guests === 1 ? 'гост' : 'гости'}
                      </span>
                      <span>·</span>
                      <span>{reservation.durationMinutes} мин.</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Маса */}
              <TableCell className='px-5 py-4'>
                <div className='flex items-baseline gap-1.5'>
                  <span className='font-bold text-on-surface text-base'>
                    #{reservation.table.number}
                  </span>
                  <span className='rounded-md bg-surface-container-high/60 px-2 py-0.5 text-[11px] font-medium text-on-surface-variant border border-outline-variant/15'>
                    {reservation.table.tableType.name}
                  </span>
                </div>
              </TableCell>

              {/* Контакт */}
              <TableCell className='px-5 py-4'>
                <p className='font-medium text-on-surface text-xs'>
                  {reservation.phone}
                </p>
                <p className='mt-0.5 text-xs text-on-surface-variant/80'>
                  {reservation.email}
                </p>
              </TableCell>

              {/* Статус */}
              <TableCell className='px-5 py-4'>
                <ReservationStatusBadge status={reservation.status} />
              </TableCell>

              {/* Акции */}
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
