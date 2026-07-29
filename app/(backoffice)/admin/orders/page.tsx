import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { OrderStatusActions } from '@/components/backoffice/StatusActionButtons'
import { orderStatusLabels, OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminOrders } from '@/lib/db/admin.services'
import { formatCurrency } from '@/lib/utils/order'
import { OrderStatus, Role } from '@/lib/generated/prisma'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await requireRouteAccess('/admin/orders')
  const params = await searchParams
  const status = Object.values(OrderStatus).includes(params.status as OrderStatus) ? params.status as OrderStatus : undefined
  const orders = await getAdminOrders({ query: params.q, status })
  const role = user.role as Role
  return <><BackofficeHeader eyebrow='Оператива' title='Нарачки' description='Пребарувајте, следете и безбедно движете ги нарачките низ процесот.' />
    <div className='space-y-6 px-6 py-8 md:px-10'><form className='flex flex-col gap-3 sm:flex-row'><Input name='q' defaultValue={params.q} placeholder='Број, име или телефон' className='max-w-md bg-surface-container-high' /><select name='status' defaultValue={status ?? ''} className='h-9 rounded-md border border-outline-variant/30 bg-surface-container-high px-3 text-sm'><option value=''>Сите статуси</option>{Object.values(OrderStatus).map((value) => <option key={value} value={value}>{orderStatusLabels[value]}</option>)}</select><Button type='submit'>Филтрирај</Button></form>
      <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'><div className='overflow-x-auto'><table className='w-full min-w-230 text-left text-sm'><thead className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'><tr><th className='px-5 py-4'>Нарачка</th><th className='px-5 py-4'>Клиент</th><th className='px-5 py-4'>Износ</th><th className='px-5 py-4'>Статус</th><th className='px-5 py-4'>Акции</th></tr></thead><tbody className='divide-y divide-outline-variant/10'>{orders.map((order) => <tr key={order.id}><td className='px-5 py-4'><p className='font-medium'>#{order.orderNumber}</p><p className='mt-1 text-xs text-on-surface-variant'>{formatBackofficeDateTime(order.createdAt)}</p></td><td className='px-5 py-4'><p>{order.customerName ?? order.user.name}</p><p className='mt-1 text-xs text-on-surface-variant'>{order.phone}</p></td><td className='px-5 py-4'>{formatCurrency(order.total)}</td><td className='px-5 py-4'><OrderStatusBadge status={order.status} /></td><td className='px-5 py-4'><OrderStatusActions orderId={order.id} status={order.status} deliveryMethod={order.deliveryMethod} role={role} /></td></tr>)}</tbody></table></div>{!orders.length ? <p className='p-12 text-center text-sm text-on-surface-variant'>Нема нарачки за избраните филтри.</p> : null}</div>
    </div></>
}
