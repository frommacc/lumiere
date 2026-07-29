import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { ReservationStatusActions } from '@/components/backoffice/StatusActionButtons'
import { reservationStatusLabels, ReservationStatusBadge } from '@/components/Reservations/ReservationStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminReservations } from '@/lib/db/admin.services'
import { getReservationDateKey } from '@/lib/reservations'
import { ReservationStatus, Role } from '@/lib/generated/prisma'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatBackofficeTime } from '@/components/backoffice/formatters'

export default async function AdminReservationsPage({ searchParams }: { searchParams: Promise<{ date?: string; status?: string }> }) {
  const user = await requireRouteAccess('/admin/reservations')
  const params = await searchParams
  const status = Object.values(ReservationStatus).includes(params.status as ReservationStatus) ? params.status as ReservationStatus : undefined
  const date = params.date || getReservationDateKey(new Date())
  const reservations = await getAdminReservations({ date, status })
  const role = user.role as Role
  return <><BackofficeHeader eyebrow='Оператива' title='Резервации' description='Дневна агенда со потврдите, гости, маси и статуси.' />
    <div className='space-y-6 px-6 py-8 md:px-10'><form className='flex flex-col gap-3 sm:flex-row'><Input name='date' type='date' defaultValue={date} className='w-full sm:w-48 bg-surface-container-high' /><select name='status' defaultValue={status ?? ''} className='h-9 rounded-md border border-outline-variant/30 bg-surface-container-high px-3 text-sm'><option value=''>Сите статуси</option>{Object.values(ReservationStatus).map((value) => <option key={value} value={value}>{reservationStatusLabels[value]}</option>)}</select><Button type='submit'>Прикажи</Button></form>
      <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'><div className='overflow-x-auto'><table className='w-full min-w-230 text-left text-sm'><thead className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'><tr><th className='px-5 py-4'>Време / Гост</th><th className='px-5 py-4'>Мasa</th><th className='px-5 py-4'>Контакт</th><th className='px-5 py-4'>Статус</th><th className='px-5 py-4'>Акции</th></tr></thead><tbody className='divide-y divide-outline-variant/10'>{reservations.map((reservation) => <tr key={reservation.id}><td className='px-5 py-4'><p className='font-medium'>{formatBackofficeTime(reservation.startTime)} · {reservation.name}</p><p className='mt-1 text-xs text-on-surface-variant'>{reservation.guests} гости · {reservation.durationMinutes} мин.</p></td><td className='px-5 py-4'>{reservation.table.number}<span className='ml-2 text-xs text-on-surface-variant'>{reservation.table.tableType.name}</span></td><td className='px-5 py-4'><p>{reservation.phone}</p><p className='mt-1 text-xs text-on-surface-variant'>{reservation.email}</p></td><td className='px-5 py-4'><ReservationStatusBadge status={reservation.status} /></td><td className='px-5 py-4'><ReservationStatusActions reservationId={reservation.id} status={reservation.status} role={role} /></td></tr>)}</tbody></table></div>{!reservations.length ? <p className='p-12 text-center text-sm text-on-surface-variant'>Нема резервации за овој ден.</p> : null}</div>
    </div></>
}
