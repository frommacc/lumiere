import {
  Check,
  UtensilsCrossed,
  Truck,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react'
import { DeliveryMethod, OrderStatus, PaymentMethod } from '../generated/prisma'

export interface StatusStep {
  key: OrderStatus
  label: string
  icon: LucideIcon
}

export const STATUS_STEPS: StatusStep[] = [
  { key: OrderStatus.PENDING, label: 'Order is\napplied', icon: Check },
  {
    key: OrderStatus.PREPARING,
    label: 'Preparing\nin the kitchen',
    icon: UtensilsCrossed,
  },
  { key: OrderStatus.IN_TRANSIT, label: 'In\ndelivery', icon: Truck },
  { key: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle2 },
]

export function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case OrderStatus.PENDING:
    case OrderStatus.CONFIRMED:
      return 0
    case OrderStatus.PREPARING:
      return 1
    case OrderStatus.READY:
    case OrderStatus.IN_TRANSIT:
      return 2
    case OrderStatus.DELIVERED:
      return 3
    default:
      return 0
  }
}

export function formatPaymentMethod(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.CARD:
      return 'Card (Online)'
    case PaymentMethod.CASH:
      return 'Cash on collection'
    default:
      return method
  }
}

export function formatDeliveryMethod(method: DeliveryMethod): string {
  return method === DeliveryMethod.PICKUP ? 'Pickup' : 'Delivery to address'
}
