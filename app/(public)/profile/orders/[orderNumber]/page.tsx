import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

import { OrderHeader } from '@/components/Orders/OrderPage/OrderHeader'
import { OrderStatusTracker } from '@/components/Orders/OrderPage/OrderStatusTracker'
import { OrderItemsList } from '@/components/Orders/OrderPage/OrderItemsList'
import { OrderDeliveryCard } from '@/components/Orders/OrderPage/OrderDeliveryCard'
import { OrderSummaryCard } from '@/components/Orders/OrderPage/OrderSummaryCard'
import { OrderMap } from '@/components/Orders/OrderPage/OrderMap'

interface PageProps {
  params: Promise<{
    orderNumber: string
  }>
}

const getOrder = async (orderNumber: string) => {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  })

  return order
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { orderNumber } = await params
  const order = await getOrder(orderNumber)

  if (!order) {
    notFound()
  }

  return (
    <main className='min-h-screen w-full bg-background text-foreground py-16'>
      <OrderHeader
        orderNumber={order.orderNumber}
        createdAt={order.createdAt}
        status={order.status}
      />

      <OrderStatusTracker status={order.status} />

      <section className='w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>          {/* Left Column: Items */}
          <div className='lg:col-span-7'>
            <OrderItemsList items={order.items} />
          </div>          {/* Right Column: Info and Account */}
          <div className='lg:col-span-5 flex flex-col gap-6'>
            <OrderDeliveryCard
              address={order.deliveryAddress}
              phone={order.phone}
              paymentMethod={order.paymentMethod}
              deliveryMethod={order.deliveryMethod}
              notes={order.notes}
            />

            <OrderSummaryCard
              subtotal={order.subtotal}
              deliveryFee={order.deliveryFee}
              total={order.total}
            />
          </div>
        </div>

        {order.deliveryMethod === 'ADDRESS' && (
          <OrderMap
            address={order.deliveryAddress}
            latitude={order.latitude}
            longitude={order.longitude}
          />
        )}
      </section>
    </main>
  )
}
