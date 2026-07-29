import Link from 'next/link'
import { ArrowRight, CalendarDays, Receipt, TableProperties } from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { OrderStatusActions, ReservationStatusActions } from '@/components/backoffice/StatusActionButtons'
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { ReservationStatusBadge } from '@/components/Reservations/ReservationStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminDashboard } from '@/lib/db/admin.services'
import { formatCurrency } from '@/lib/utils/order'
import { Role } from '@/lib/generated/prisma'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

export default async function AdminDashboardPage() {
  const user = await requireRouteAccess('/admin/dashboard')
  const dashboard = await getAdminDashboard()
  const role = user.role as Role
  const metrics = [
    { label: 'Нови нарачки', value: dashboard.newOrders, Icon: Receipt, href: '/admin/orders' },
    { label: 'Активни резервации', value: dashboard.activeReservations, Icon: CalendarDays, href: '/admin/reservations' },
    { label: 'Зафатени маси', value: `${dashboard.occupiedTables}/${dashboard.totalTables}`, Icon: TableProperties, href: '/admin/tables' },
  ]

  return (
    <>
      <BackofficeHeader eyebrow='Оперативен преглед' title='Контролна табла' description='Дневната состојба на ресторанот, со најважните акции на едно место.' />
      <div className='space-y-8 px-6 py-8 md:px-10'>
        <section className='grid gap-4 md:grid-cols-3'>
          {metrics.map(({ label, value, Icon, href }) => (
            <Link key={label} href={href} className='group rounded-xl border border-outline-variant/20 bg-surface-container-low/50 p-6 transition-colors hover:border-primary/40 hover:bg-surface-container-high/45'>
              <div className='flex items-start justify-between'><Icon className='size-5 text-primary' /><ArrowRight className='size-4 text-outline transition-transform group-hover:translate-x-1 group-hover:text-primary' /></div>
              <p className='mt-7 font-display text-4xl text-on-surface'>{value}</p>
              <p className='mt-1 font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant'>{label}</p>
            </Link>
          ))}
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          <div className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
            <div className='flex items-center justify-between border-b border-outline-variant/15 px-6 py-5'><div><p className='font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary'>Нарачки</p><h2 className='mt-1 font-display text-2xl'>Најнови нарачки</h2></div><Link href='/admin/orders' className='text-xs text-primary hover:underline'>Сите</Link></div>
            <div className='divide-y divide-outline-variant/10'>
              {dashboard.recentOrders.map((order) => <div key={order.id} className='space-y-3 p-5'><div className='flex flex-wrap items-center justify-between gap-3'><div><p className='font-medium'>#{order.orderNumber}</p><p className='mt-1 text-xs text-on-surface-variant'>{order.customerName ?? order.user.name} · {formatCurrency(order.total)}</p></div><OrderStatusBadge status={order.status} /></div><OrderStatusActions orderId={order.id} status={order.status} deliveryMethod={order.deliveryMethod} role={role} /></div>)}
              {!dashboard.recentOrders.length ? <Empty label='Нема нови нарачки.' /> : null}
            </div>
          </div>
          <div className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
            <div className='flex items-center justify-between border-b border-outline-variant/15 px-6 py-5'><div><p className='font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary'>Резервации</p><h2 className='mt-1 font-display text-2xl'>Чекаат потврда</h2></div><Link href='/admin/reservations' className='text-xs text-primary hover:underline'>Сите</Link></div>
            <div className='divide-y divide-outline-variant/10'>
              {dashboard.pendingReservations.map((reservation) => <div key={reservation.id} className='space-y-3 p-5'><div className='flex flex-wrap items-center justify-between gap-3'><div><p className='font-medium'>{reservation.name} · {reservation.guests} гости</p><p className='mt-1 text-xs text-on-surface-variant'>{reservation.table.tableType.name} · {formatBackofficeDateTime(reservation.startTime)}</p></div><ReservationStatusBadge status={reservation.status} /></div><ReservationStatusActions reservationId={reservation.id} status={reservation.status} role={role} /></div>)}
              {!dashboard.pendingReservations.length ? <Empty label='Нема резервации што чекаат.' /> : null}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function Empty({ label }: { label: string }) { return <p className='px-6 py-12 text-center text-sm text-on-surface-variant'>{label}</p> }
