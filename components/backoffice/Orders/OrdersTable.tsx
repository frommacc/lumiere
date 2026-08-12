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
  emptyMessage = 'No orders found.',
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
              <TableHead className='w-32'>Order</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>                {/* ID and Date */}
                <TableCell className='font-medium'>
                  <div>#{order.orderNumber}</div>
                  <div
                    className='text-xs text-muted-foreground'
                    suppressHydrationWarning
                  >
                    {formatBackofficeDateTime(order.createdAt)}
                  </div>
                </TableCell>                {/* Client */}
                <TableCell>
                  <div className='font-medium'>                    {order.customerName ?? order.user?.name ?? 'Anonymous'}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {order.phone}
                  </div>
                </TableCell>                {/* Delivery */}
                <TableCell>
                  <Badge variant='outline' className='text-xs'>                    { order.deliveryMethod === DeliveryMethod.ADDRESS
                      ? 'Delivery Address'
                      : 'Upload'}
                  </Badge>
                </TableCell>                {/* Payment */}
                <TableCell>
                  <Badge variant='secondary' className='text-xs'>                    {order.paymentMethod === PaymentMethod.CASH
                      ? 'Cash'
                      : 'Card'}
                  </Badge>
                </TableCell>                {/* Amount */}
                <TableCell className='font-semibold'>
                  <span suppressHydrationWarning>
                    {formatCurrency(order.total)}
                  </span>
                </TableCell>                {/* Status */}
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>                {/* Details Button + Change Status / Delete */}
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>                    {/* View details */}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setSelectedOrder(order)}
                      title='See details'
                    >
                      <Eye className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                      <span className='sr-only'>Details</span>
                    </Button>                    {/* Action menu */}
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
      </div>      {/* Details modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  )
}
