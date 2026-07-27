import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserOrders } from '@/lib/db/orders.services'
import { OrderCard } from '@/components/Orders/OrderCard'
import { EmptyOrdersState } from '@/components/Orders/EmptyOrdersState'
import { LoadMoreOrders } from '@/components/Orders/LoadMoreOrders'

interface OrdersContentProps {
  searchParams: Promise<{ q?: string; limit?: string }>
}

export async function OrdersContent({ searchParams }: OrdersContentProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login?callbackUrl=/profile/orders')
  }

  const resolvedParams = await searchParams
  const query = resolvedParams?.q
  const limit = Number(resolvedParams?.limit) || 10

  const { orders, hasMore } = await getUserOrders({
    userId: session.user.id,
    query,
    limit,
  })

  if (orders.length === 0) {
    return <EmptyOrdersState />
  }

  return (
    <>
      <div className='flex flex-col gap-12'>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <LoadMoreOrders currentLimit={limit} hasMore={hasMore} pageSize={10} />
    </>
  )
}
