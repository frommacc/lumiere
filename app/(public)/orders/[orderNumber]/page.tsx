import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma' // Прилагоди ја патеката според твојот проект

import { OrderHeader } from '@/components/Order/OrderHeader'
import { OrderStatusTracker } from '@/components/Order/OrderStatusTracker'
import { OrderItemsList } from '@/components/Order/OrderItemsList'
import { OrderDeliveryCard } from '@/components/Order/OrderDeliveryCard'
import { OrderSummaryCard } from '@/components/Order/OrderSummaryCard'

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
    <main className='min-h-screen w-full bg-background text-foreground py-20'>
      <OrderHeader
        orderNumber={order.orderNumber}
        createdAt={order.createdAt}
        status={order.status}
      />

      <OrderStatusTracker status={order.status} />

      <section className='w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* Лева Колона: Артикли */}
          <div className='lg:col-span-7'>
            <OrderItemsList items={order.items} />
          </div>

          {/* Десна Колона: Информации и Сметка */}
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
      </section>
    </main>
  )
}
