'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'
import { formatCurrency } from '@/lib/utils/order'
import { Role, DeliveryMethod, PaymentMethod } from '@/lib/generated/prisma'
import { Eye } from 'lucide-react'

import { OrderDetailsModal, OrderDetailData } from './OrderDetailsModal'
import { OrderActionsMenu } from './OrderActionsMenu'

interface OrdersTableProps {
  orders: OrderDetailData[]
  role: Role
  emptyMessage?: string
}

export function OrdersTable({
  orders,
  role,
  emptyMessage = 'Нема пронајдено нарачки.',
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailData | null>(
    null,
  )

  if (orders.length === 0) {
    return (
      <div className='flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground'>
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-32'>Нарачка</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Достава</TableHead>
              <TableHead>Плаќање</TableHead>
              <TableHead>Износ</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className='text-right'>Акции</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                {/* ID и Дата */}
                <TableCell className='font-medium'>
                  <div>#{order.orderNumber}</div>
                  <div
                    className='text-xs text-muted-foreground'
                    suppressHydrationWarning
                  >
                    {formatBackofficeDateTime(order.createdAt)}
                  </div>
                </TableCell>

                {/* Клиент */}
                <TableCell>
                  <div className='font-medium'>
                    {order.customerName ?? order.user?.name ?? 'Анонимен'}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {order.phone}
                  </div>
                </TableCell>

                {/* Достава */}
                <TableCell>
                  <Badge variant='outline' className='text-xs'>
                    {order.deliveryMethod === DeliveryMethod.ADDRESS
                      ? 'Адресна достава'
                      : 'Подигање'}
                  </Badge>
                </TableCell>

                {/* Плаќање */}
                <TableCell>
                  <Badge variant='secondary' className='text-xs'>
                    {order.paymentMethod === PaymentMethod.CASH
                      ? 'Готовина'
                      : 'Картичка'}
                  </Badge>
                </TableCell>

                {/* Износ */}
                <TableCell className='font-semibold'>
                  <span suppressHydrationWarning>
                    {formatCurrency(order.total)}
                  </span>
                </TableCell>

                {/* Статус */}
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>

                {/* Копче за Детали + Менување Статус / Бришење */}
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    {/* Преглед на детали */}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setSelectedOrder(order)}
                      title='Види детали'
                    >
                      <Eye className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                      <span className='sr-only'>Детали</span>
                    </Button>

                    {/* Мени со акции */}
                    <OrderActionsMenu
                      orderId={order.id}
                      currentStatus={order.status}
                      role={role}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Модал за детали */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  )
}
