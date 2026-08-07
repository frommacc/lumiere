import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { OrderStatus, Role } from '@/lib/generated/prisma'
import { getAdminOrders } from '@/lib/db/backoffice/orders.services'
import { SearchInput } from '@/components/backoffice/shared/SearchInput'
import { OrdersTable } from '@/components/backoffice/Orders/OrdersTable'
import { OrderStatusFilter } from '@/components/backoffice/Orders/OrderStatusFilter'
import { requireRouteAccess } from '@/lib/authorization'
import { PaginationControls } from '@/components/backoffice/shared/pagination-controls'
import { DateRangePicker } from '@/components/backoffice/shared/DateRangePicker'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
    from?: string
    to?: string
  }>
}) {
  const user = await requireRouteAccess('/admin/orders')

  const params = await searchParams

  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)

  const status = Object.values(OrderStatus).includes(
    params.status as OrderStatus,
  )
    ? (params.status as OrderStatus)
    : undefined

  const { orders, totalPages, totalItems, pageSize } = await getAdminOrders({
    query: params.q,
    status,
    page,
    from: params.from,
    to: params.to,
    pageSize: 10,
  })

  const role = user.role as Role

  return (
    <>
      <BackofficeHeader
        eyebrow='Оператива'
        title='Нарачки'
        description='Пребарувајте, следете и безбедно движете ги нарачките низ процесот.'
      />
      <div className='space-y-6 px-6 py-8 md:px-10'>
        <div className='flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap items-center gap-4'>
          {/* Пребарување: Мобилен (w-full), sm (цел нов ред w-full), md (автоматска ширина во истиот ред) */}
          <div className='w-full md:w-80 lg:w-100 md:shrink-0'>
            <SearchInput placeholder='Пребарај по број, име или телефон' />
          </div>

          {/* Статус филтер: Мобилен (w-full), sm (во ист ред со DatePicker, w-auto), md (во ист ред) */}
          <div className='w-full sm:w-auto'>
            <OrderStatusFilter currentStatus={params.status} />
          </div>

          {/* DateRangePicker: Мобилен (w-full), sm (во ист ред со StatusFilter, го зема преостанатиот простор со flex-1), md (ml-auto) */}
          <div className='w-full sm:w-auto sm:flex-1 md:flex-none md:ml-auto'>
            <DateRangePicker />
          </div>
        </div>

        <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
          <OrdersTable orders={orders} role={role} />

          {orders.length && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          )}
        </div>
      </div>
    </>
  )
}
