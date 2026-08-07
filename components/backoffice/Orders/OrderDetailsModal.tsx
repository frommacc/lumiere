'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OrderStatusBadge } from '@/components/Orders/OrderStatusBadge'
import { formatCurrency } from '@/lib/utils/order'
import {
  DeliveryMethod,
  PaymentMethod,
  OrderStatus,
  PaymentStatus,
} from '@/lib/generated/prisma'
import { MapPin, Phone, User, CreditCard, Truck, FileText } from 'lucide-react'

export interface OrderItemDetail {
  id: string
  quantity: number
  price: number
  name: string
}

export interface OrderDetailData {
  id: string
  orderNumber: string
  customerName: string | null
  phone: string
  deliveryAddress: string | null
  notes: string | null
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  }
  items?: OrderItemDetail[]
}

interface OrderDetailsModalProps {
  order: OrderDetailData | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between pr-4'>
            <span>Нарачка #{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 text-sm'>
          {/* Податоци за клиент */}
          <div className='rounded-lg border p-3 space-y-1.5 bg-muted/30'>
            <div className='flex items-center gap-2 font-medium'>
              <User className='h-4 w-4 text-muted-foreground' />
              <span>{order.customerName ?? order.user.name ?? 'Анонимен'}</span>
            </div>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Phone className='h-4 w-4' />
              <span>{order.phone}</span>
            </div>
            {order.deliveryMethod === DeliveryMethod.ADDRESS && (
              <div className='flex items-start gap-2 text-muted-foreground'>
                <MapPin className='h-4 w-4 mt-0.5 shrink-0' />
                <span>{order.deliveryAddress ?? 'Нема внесено адреса'}</span>
              </div>
            )}
          </div>

          {/* Информации за испорака и плаќање */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='rounded-lg border p-2.5 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Truck className='h-3.5 w-3.5' />
                <span>Испорака</span>
              </div>
              <p className='font-medium'>
                {order.deliveryMethod === DeliveryMethod.ADDRESS
                  ? 'Достава до адреса'
                  : 'Лично подигање'}
              </p>
            </div>
            <div className='rounded-lg border p-2.5 space-y-1'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <CreditCard className='h-3.5 w-3.5' />
                <span>Плаќање</span>
              </div>
              <p className='font-medium'>
                {order.paymentMethod === PaymentMethod.CASH
                  ? 'Готовина'
                  : 'Картичка'}{' '}
                ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Забелешка (доколку постои) */}
          {order.notes && (
            <div className='rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200'>
              <div className='flex items-center gap-1.5 font-medium text-xs mb-1'>
                <FileText className='h-3.5 w-3.5' />
                <span>Забелешка:</span>
              </div>
              <p className='text-xs'>{order.notes}</p>
            </div>
          )}

          {/* Список на ставки од нарачката */}
          <div>
            <h4 className='font-medium mb-2'>Ставки</h4>
            <div className='border rounded-lg divide-y max-h-40 overflow-y-auto'>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center p-2 text-xs'
                  >
                    <div>
                      <span className='font-semibold'>{item.quantity}x </span>
                      <span>{item.name}</span>
                    </div>
                    <span className='font-medium'>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <p className='p-3 text-xs text-muted-foreground text-center'>
                  Нема детални ставки за прикажување.
                </p>
              )}
            </div>
          </div>

          {/* Рекапитулација на цената */}
          <div className='space-y-1 pt-2 border-t text-xs'>
            <div className='flex justify-between text-muted-foreground'>
              <span>Подсметка:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className='flex justify-between text-muted-foreground'>
              <span>Достава:</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className='flex justify-between font-semibold text-sm pt-1 text-foreground'>
              <span>Вкупно:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
