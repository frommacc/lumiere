import { requireRouteAccess } from '@/lib/authorization'
import { getKitchenOrders } from '@/lib/db/backoffice/orders.services'
import { Role } from '@/lib/generated/prisma'
import { KdsBoardView } from '@/components/backoffice/Kitchen/KdsBoardView'

export default async function KitchenOrdersPage() {
  const user = await requireRouteAccess('/kitchen/orders')
  const orders = await getKitchenOrders()
  const role = user.role as Role

  return <KdsBoardView initialOrders={orders} role={role} />
}
