'use client'

import { useState } from 'react'
import { ReservationStatus, Role } from '@/lib/generated/prisma'
import { ReservationsTable, AdminReservation } from './ReservationsTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ActiveReservationsSectionProps {
  reservations: AdminReservation[]
  role: Role
}

export function ActiveReservationsSection({
  reservations,
  role,
}: ActiveReservationsSectionProps) {
  // Default: CONFIRMED and SEATED
  const [filter, setFilter] = useState<string>('ACTIVE')

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'ACTIVE') {
      return (
        r.status === ReservationStatus.CONFIRMED ||
        r.status === ReservationStatus.SEATED
      )
    }
    if (filter === 'COMPLETED') {
      return r.status === ReservationStatus.COMPLETED
    }
    if (filter === 'CLOSED') {
      return (
        r.status === ReservationStatus.CANCELLED ||
        r.status === ReservationStatus.NO_SHOW
      )
    }
    return true // 'ALL'
  })

  const activeCount = reservations.filter(
    (r) =>
      r.status === ReservationStatus.CONFIRMED ||
      r.status === ReservationStatus.SEATED,
  ).length

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-base font-semibold tracking-tight text-on-surface'>          Daily agenda
        </h2>        {/* Filter for the second table */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className='w-full sm:w-60 bg-surface-container-high border-outline-variant/30 px-2'>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ACTIVE'>              Confirmed & Seated ({activeCount})
            </SelectItem>
            <SelectItem value='ALL'>              All others ({reservations.length})
            </SelectItem>
            <SelectItem value='COMPLETED'>
              Completed (
              {
                reservations.filter(
                  (r) => r.status === ReservationStatus.COMPLETED,
                ).length
              }
              )
            </SelectItem>
            <SelectItem value='CLOSED'>
              Cancelled / No-shows (
              {
                reservations.filter(
                  (r) =>
                    r.status === ReservationStatus.CANCELLED ||
                    r.status === ReservationStatus.NO_SHOW,
                ).length
              }
              )
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReservationsTable reservations={filteredReservations} role={role} />
    </div>
  )
}
