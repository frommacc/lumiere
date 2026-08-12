import Link from 'next/link'
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  ChefHat,
  Clock,
  Flame,
  MessageSquare,
  PackageX,
  Receipt,
  TableProperties,
  User,
} from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { requireRouteAccess } from '@/lib/authorization'
import { OrderStatus, Role } from '@/lib/generated/prisma'
import { getAdminDashboard } from '@/lib/db/backoffice/dashboard.services'

// Translation and colors for order statuses
const orderStatusMap: Record<
  OrderStatus,
  { label: string; colorClass: string }
> = {
  PENDING: {
    label: 'New',
    colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  CONFIRMED: {
    label: 'Confirmed',
    colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  PREPARING: {
    label: 'Ready',
    colorClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  },
  READY: {
    label: 'Ready',
    colorClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  },
  IN_TRANSIT: {
    label: 'Shipping',
    colorClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  DELIVERED: {
    label: 'Delivered',
    colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  CANCELED: {
    label: 'Cancelled',
    colorClass: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
}

export default async function AdminDashboardPage() {
  const user = await requireRouteAccess('/admin/dashboard')
  const dashboard = await getAdminDashboard()
  const role = user.role as Role

  const kpiMetrics = [
    {
      label: 'Daily Traffic',
      value: `${dashboard.todayRevenue.toLocaleString('en-US')} day.`,
      Icon: Banknote,
      href: '/admin/orders',
      highlight: true,
    },
    {
      label: 'New Orders',
      value: dashboard.newOrders,
      Icon: Receipt,
      href: '/admin/orders',
    },
    {
      label: 'In the kitchen',
      value: dashboard.kitchenOrdersCount,
      Icon: ChefHat,
      href: '/admin/orders?status=PREPARING',
    },
    {
      label: 'Active bookings',
      value: dashboard.activeReservations,
      Icon: CalendarDays,
      href: '/admin/reservations',
    },
    {
      label: 'Busy Tables',
      value: `${dashboard.occupiedTables}/${dashboard.totalTables}`,
      Icon: TableProperties,
      href: '/admin/tables',
    },
  ]

  return (
    <>
      <BackofficeHeader
        eyebrow='Operational review'
        title='Control panel'
        description='Daily restaurant status, analytics and key actions in one place.'
      />

      <div className='space-y-8 px-6 py-8 md:px-10'>
        {/* --- ALERT BADGES --- */}
        {(dashboard.pendingReviewsCount > 0 ||
          dashboard.unavailableMenuItemsCount > 0) && (
          <div className='grid gap-4 md:grid-cols-2'>
            {dashboard.pendingReviewsCount > 0 && (
              <Link
                href='/admin/reviews'
                className='flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 transition-colors hover:bg-amber-500/20'
              >
                <div className='flex items-center gap-3'>
                  <MessageSquare className='size-5 text-amber-400' />
                  <span className='text-sm font-medium'>                    You have {' '}
                    <strong className='font-bold'>
                      {dashboard.pendingReviewsCount}
                    </strong>{' '}
                    new reviews awaiting approval.
                  </span>
                </div>
                <ArrowRight className='size-4 text-amber-400' />
              </Link>
            )}

            {dashboard.unavailableMenuItemsCount > 0 && (
              <Link
                href='/admin/menu'
                className='flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200 transition-colors hover:bg-rose-500/20'
              >
                <div className='flex items-center gap-3'>
                  <PackageX className='size-5 text-rose-400' />
                  <span className='text-sm font-medium'>
                    <strong className='font-bold'>
                      {dashboard.unavailableMenuItemsCount}
                    </strong>{' '}
                    menu items are marked as unavailable.
                  </span>
                </div>
                <ArrowRight className='size-4 text-rose-400' />
              </Link>
            )}
          </div>        )}

        {/* --- KPI METRICS --- */}<section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {kpiMetrics.map(({ label, value, Icon, href, highlight }) => (
            <Link
              key={label}
              href={href}
              className={`group rounded-xl border p-5 transition-all hover:border-primary/50 hover:bg-surface-container-high/60 ${
                highlight
                  ? 'border-primary/40 bg-primary/10'
                  : 'border-outline-variant/20 bg-surface-container-low/50'
              }`}
            >
              <div className='flex items-start justify-between'>
                <Icon
                  className={`size-5 ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}
                />
                <ArrowRight className='size-4 text-outline transition-transform group-hover:translate-x-1 group-hover:text-primary' />
              </div>
              <p className='mt-5 font-display text-3xl font-semibold text-on-surface'>
                {value}
              </p>
              <p className='mt-1 font-label-caps text-[10px] uppercase tracking-[0.15em] text-on-surface-variant'>
                {label}
              </p>
            </Link>
          ))}
        </section>        {/* --- TWO COLUMNS: LAST ORDERS & PENDING RESERVATIONS --- */}
        <div className='grid gap-8 lg:grid-cols-2'>          {/* Recent Orders */}
          <section className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-on-surface'>                  Last Orders
                </h3>
                <p className='text-xs text-on-surface-variant'>                  The latest orders entered into the system
                </p>
              </div>
              <Link
                href='/admin/orders'
                className='flex items-center gap-1 text-xs font-medium text-primary hover:underline'
              >                See all <ArrowRight className='size-3' />
              </Link>
            </div>

            <div className='space-y-3'>
              {dashboard.recentOrders.length === 0 ? (
                <p className='py-8 text-center text-sm text-outline'>                  No new orders today.
                </p>
              ) : (
                dashboard.recentOrders.map((order) => {
                  const statusInfo = orderStatusMap[order.status]
                  return (
                    <div
                      key={order.id}
                      className='flex flex-col justify-between gap-3 rounded-lg border border-outline-variant/10 bg-surface-container/50 p-4 sm:flex-row sm:items-center'
                    >
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono text-sm font-bold text-on-surface'>
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusInfo.colorClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className='flex items-center gap-1 text-xs text-on-surface-variant'>
                          <User className='size-3' />{' '}
                          {order.customerName || order.user.name} (
                          {order.items.length} items)
                        </p>
                      </div>

                      <div className='flex items-center justify-between sm:flex-col sm:items-end'>
                        <span className='font-display text-base font-bold text-on-surface'>                          {order.total.toLocaleString('en-US')} day.
                        </span>
                        <span className='flex items-center gap-1 text-[11px] text-outline'>
                          <Clock className='size-3' />
                          {new Date(order.createdAt).toLocaleTimeString(
                            'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>          {/* Reservations awaiting confirmation */}
          <section className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-on-surface'>                  Awaiting Confirmation
                </h3>
                <p className='text-xs text-on-surface-variant'>                  Reservations requiring approval
                </p>
              </div>
              <Link
                href='/admin/reservations?status=PENDING'
                className='flex items-center gap-1 text-xs font-medium text-primary hover:underline'
              >                Manage <ArrowRight className='size-3' />
              </Link>
            </div>

            <div className='space-y-3'>
              {dashboard.pendingReservations.length === 0 ? (
                <p className='py-8 text-center text-sm text-outline'>                  There are no reservations awaiting confirmation.
                </p>
              ) : (
                dashboard.pendingReservations.map((res) => (
                  <div
                    key={res.id}
                    className='flex flex-col justify-between gap-3 rounded-lg border border-outline-variant/10 bg-surface-container/50 p-4 sm:flex-row sm:items-center'
                  >
                    <div className='space-y-1'>
                      <p className='font-medium text-on-surface'>{res.name}</p>
                      <p className='text-xs text-on-surface-variant'>                        Table:{' '}
                        <strong className='text-on-surface'>
                          #{res.table.number}
                        </strong>{' '}
                        ({res.table.tableType.name}) • {res.guests} guests
                      </p>
                    </div>

                    <div className='flex items-center justify-between sm:flex-col sm:items-end'>
                      <span className='rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
                        {new Date(res.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className='mt-1 text-[11px] text-outline'>
                        {new Date(res.startTime).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>        {/* --- BOTTOM SECTION: TOP SELLING DISHES --- */}
        <section className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-6'>
          <div className='mb-5 flex items-center gap-2'>
            <Flame className='size-5 text-amber-500' />
            <h3 className='text-lg font-semibold text-on-surface'>              Top 5 Best Selling Dishes
            </h3>
          </div>

          {dashboard.topSellingItems.length === 0 ? (
            <p className='py-4 text-center text-sm text-outline'>              Not enough sales data.
            </p>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-5'>
              {dashboard.topSellingItems.map((item, index) => (
                <div
                  key={item.name}
                  className='relative flex flex-col justify-between rounded-lg border border-outline-variant/10 bg-surface-container/30 p-4'
                >
                  <span className='absolute right-3 top-3 text-2xl font-black text-outline/20'>
                    #{index + 1}
                  </span>
                  <p className='pr-6 text-sm font-semibold text-on-surface line-clamp-1'>
                    {item.name}
                  </p>
                  <div className='mt-4 flex items-baseline justify-between'>
                    <span className='text-xs text-on-surface-variant'>                      Sold:
                    </span>
                    <span className='font-mono text-base font-bold text-primary'>
                      {item._sum.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
