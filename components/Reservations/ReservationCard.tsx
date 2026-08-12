'use client'

import { CalendarDays, Clock3, UsersRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatReservationDate, formatReservationDuration, formatReservationTime } from './reservation-format'
import { ReservationStatusBadge } from './ReservationStatusBadge'
import type { ReservationWithTable } from './types'

interface ReservationCardProps {
  reservation: ReservationWithTable
  onDetails: (reservation: ReservationWithTable) => void
}

export function ReservationCard({ reservation, onDetails }: ReservationCardProps) {
  return (
    <article className='group flex flex-col gap-6 border-l-2 border-primary bg-surface-container-low/40 p-6 backdrop-blur-sm transition-colors hover:bg-surface-container-high/60 md:flex-row md:items-end md:justify-between md:p-8'>
      <div className='space-y-5'>
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
          <ReservationStatusBadge status={reservation.status} />
          <span className='font-label-caps text-[10px] uppercase tracking-widest text-outline'>
            {reservation.table.tableType.name}
          </span>
        </div>

        <div>
          <h2 className='font-display text-2xl text-on-surface md:text-3xl'>
            {formatReservationDate(reservation.startTime)}
          </h2>
          <p className='mt-1 text-sm text-on-surface-variant'>            Reservation for {reservation.guests}{' '}
            {reservation.guests === 1 ? 'face' : 'faces'}
          </p>
        </div>

        <div className='flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-surface'>
          <span className='flex items-center gap-2'>
            <Clock3 className='size-4 text-primary' />
            {formatReservationTime(reservation.startTime)} ·{' '}
            {formatReservationDuration(reservation.durationMinutes)}
          </span>
          <span className='flex items-center gap-2'>
            <UsersRound className='size-4 text-primary' />
            {reservation.table.tableType.name}
          </span>
        </div>
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={() => onDetails(reservation)}
        className='min-w-44 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground'
      >
        <CalendarDays />        Details
      </Button>
    </article>
  )
}
