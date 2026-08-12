import { ReservationStatus } from '@/lib/generated/prisma'

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Sent',
  [ReservationStatus.CONFIRMED]: 'Confirmed',
  [ReservationStatus.SEATED]: 'In Progress',
  [ReservationStatus.COMPLETED]: 'Completed',
  [ReservationStatus.CANCELLED]: 'Cancelled',
  [ReservationStatus.NO_SHOW]: 'Not Visited',
}

const statusConfig: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  [ReservationStatus.PENDING]: {
    label: reservationStatusLabels[ReservationStatus.PENDING],
    className: 'bg-primary/10 text-primary',
  },
  [ReservationStatus.CONFIRMED]: {
    label: reservationStatusLabels[ReservationStatus.CONFIRMED],
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  [ReservationStatus.SEATED]: {
    label: reservationStatusLabels[ReservationStatus.SEATED],
    className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  [ReservationStatus.COMPLETED]: {
    label: reservationStatusLabels[ReservationStatus.COMPLETED],
    className: 'bg-surface-container-highest text-on-surface-variant',
  },
  [ReservationStatus.CANCELLED]: {
    label: reservationStatusLabels[ReservationStatus.CANCELLED],
    className: 'bg-destructive/10 text-destructive',
  },
  [ReservationStatus.NO_SHOW]: {
    label: reservationStatusLabels[ReservationStatus.NO_SHOW],
    className: 'bg-destructive/10 text-destructive',
  },
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const config = statusConfig[status]

  return (
    <span
      className={`rounded-full px-3 py-1 font-label-caps text-[10px] uppercase tracking-[0.2em] ${config.className}`}
    >
      {config.label}
    </span>
  )
}
