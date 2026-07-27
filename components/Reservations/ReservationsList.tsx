'use client'

import { useState } from 'react'

import { ReservationCard } from './ReservationCard'
import { ReservationDetailsDialog } from './ReservationDetailsDialog'
import type { ReservationWithTable } from './types'

export function ReservationsList({
  reservations,
}: {
  reservations: ReservationWithTable[]
}) {
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationWithTable | null>(null)

  return (
    <>
      <div className='flex flex-col gap-5'>
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onDetails={setSelectedReservation}
          />
        ))}
      </div>

      <ReservationDetailsDialog
        reservation={selectedReservation}
        onOpenChange={(open) => !open && setSelectedReservation(null)}
      />
    </>
  )
}
