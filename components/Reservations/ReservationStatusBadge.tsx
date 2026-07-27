import { ReservationStatus } from '@/lib/generated/prisma'

const statusConfig: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  [ReservationStatus.PENDING]: {
    label: 'Испратена',
    className: 'bg-primary/10 text-primary',
  },
  [ReservationStatus.CONFIRMED]: {
    label: 'Потврдена',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  [ReservationStatus.SEATED]: {
    label: 'Во тек',
    className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  [ReservationStatus.COMPLETED]: {
    label: 'Завршена',
    className: 'bg-surface-container-highest text-on-surface-variant',
  },
  [ReservationStatus.CANCELLED]: {
    label: 'Откажана',
    className: 'bg-destructive/10 text-destructive',
  },
  [ReservationStatus.NO_SHOW]: {
    label: 'Не е посетена',
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
