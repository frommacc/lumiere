import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { requireRouteAccess } from '@/lib/authorization'
import { getReservationDateKey } from '@/lib/reservations'
import { ReservationStatus, Role } from '@/lib/generated/prisma'
import { getAdminReservations } from '@/lib/db/reservations.services'
import { PendingReservationsTable } from '@/components/backoffice/Reservations/PendingReservationsTable'
import { ActiveReservationsSection } from '@/components/backoffice/Reservations/ActiveReservationsSection'
import { DatePickerFilter } from '@/components/backoffice/Reservations/DatePickerFilter'

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const user = await requireRouteAccess('/admin/reservations')
  const params = await searchParams

  const date = params.date || getReservationDateKey(new Date())
  const allReservations = await getAdminReservations({ date })
  const role = user.role as Role

  // 1. Нови барања (PENDING)
  const pendingReservations = allReservations.filter(
    (r) => r.status === ReservationStatus.PENDING,
  )

  // 2. Сите останати резервации (Освен PENDING)
  const otherReservations = allReservations.filter(
    (r) => r.status !== ReservationStatus.PENDING,
  )

  return (
    <>
      <BackofficeHeader
        eyebrow='Оператива'
        title='Резервации'
        description='Управување со нови барања и дневна агенда.'
        actions={<DatePickerFilter initialDate={date} />}
      />

      <div className='space-y-16 px-6 py-8 md:px-10'>
        {/* 1. СЕКЦИЈА: Нови барања (PENDING) */}
        <section className='space-y-3'>
          <div className='flex items-center gap-2.5'>
            <h2 className='text-base font-semibold tracking-tight text-on-surface'>
              Нови барања
            </h2>
            {pendingReservations.length > 0 && (
              <span className='rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20'>
                {pendingReservations.length}
              </span>
            )}
          </div>

          <PendingReservationsTable
            reservations={pendingReservations}
            role={role}
          />
        </section>

        {/* 2. СЕКЦИЈА: Дневна агенда со филтер */}
        <section className='space-y-4 pt-4 border-t border-outline-variant/15'>
          <ActiveReservationsSection
            reservations={otherReservations}
            role={role}
          />
        </section>
      </div>
    </>
  )
}
