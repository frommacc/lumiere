'use client'

import { CalendarDays, Clock3, Mail, MapPin, Phone, UsersRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatReservationDate, formatReservationDuration, formatReservationTime } from './reservation-format'
import { ReservationStatusBadge } from './ReservationStatusBadge'
import type { ReservationWithTable } from './types'

interface ReservationDetailsDialogProps {
  reservation: ReservationWithTable | null
  onOpenChange: (open: boolean) => void
}

export function ReservationDetailsDialog({
  reservation,
  onOpenChange,
}: ReservationDetailsDialogProps) {
  if (!reservation) return null

  const isPending = reservation.status === 'PENDING'

  return (
    <Dialog open={!!reservation} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-xl'>
        <DialogHeader className='space-y-3 text-left'>
          <div className='flex flex-wrap items-center gap-3'>
            <ReservationStatusBadge status={reservation.status} />
            <span className='font-mono text-xs tracking-widest text-outline'>
              #{reservation.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <DialogTitle className='font-display text-3xl'>Детали за резервација</DialogTitle>
          <DialogDescription className='text-on-surface-variant'>
            {isPending
              ? 'Барањето е испратено. Ќе добиете е-пошта кога ресторанот ќе ја потврди резервацијата.'
              : 'Податоци за вашата резервација.'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-3 sm:grid-cols-2'>
          <Detail icon={CalendarDays} label='Датум' value={formatReservationDate(reservation.startTime)} />
          <Detail
            icon={Clock3}
            label='Време'
            value={`${formatReservationTime(reservation.startTime)} – ${formatReservationTime(reservation.endTime)}`}
          />
          <Detail icon={UsersRound} label='Гости' value={`${reservation.guests} ${reservation.guests === 1 ? 'лице' : 'лица'}`} />
          <Detail icon={Clock3} label='Планирано седење' value={formatReservationDuration(reservation.durationMinutes)} />
          <Detail icon={MapPin} label='Амбиент' value={reservation.table.tableType.name} />
          <Detail icon={MapPin} label='Доделена маса' value={reservation.table.number} />
        </div>

        <section className='space-y-3 border-t border-outline-variant/20 pt-5'>
          <h3 className='font-label-caps text-[10px] uppercase tracking-widest text-primary'>Контакт</h3>
          <div className='grid gap-3 text-sm sm:grid-cols-2'>
            <p className='flex items-center gap-2'><Mail className='size-4 text-primary' />{reservation.email}</p>
            <p className='flex items-center gap-2'><Phone className='size-4 text-primary' />{reservation.phone}</p>
          </div>
        </section>

        {reservation.specialRequests && (
          <section className='border-t border-outline-variant/20 pt-5'>
            <h3 className='font-label-caps text-[10px] uppercase tracking-widest text-primary'>Посебни барања</h3>
            <p className='mt-2 rounded-md bg-surface-container-high p-3 text-sm text-on-surface-variant'>
              {reservation.specialRequests}
            </p>
          </section>
        )}

        <div className='flex justify-end border-t border-outline-variant/20 pt-5'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>Затвори</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className='rounded-lg border border-outline-variant/20 bg-surface-container-high/50 p-4'>
      <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-outline'>
        <Icon className='size-3.5 text-primary' />
        {label}
      </div>
      <p className='mt-2 text-sm font-medium text-on-surface'>{value}</p>
    </div>
  )
}
