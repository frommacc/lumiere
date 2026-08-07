import { requireRouteAccess } from '@/lib/authorization'
import { getStaffOrders } from '@/lib/db/backoffice/orders.services'
import { Role } from '@/lib/generated/prisma'
import { StaffBoardView } from '@/components/backoffice/Staff/StaffBoardView'

export default async function StaffOrdersPage() {
  const user = await requireRouteAccess('/staff/orders')
  const orders = await getStaffOrders()
  const role = user.role as Role

  return <StaffBoardView initialOrders={orders} role={role} />
}
