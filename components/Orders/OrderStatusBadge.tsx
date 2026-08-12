import { OrderStatus } from '@/lib/generated/prisma'

export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Apply',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.READY]: 'Ready',
  [OrderStatus.IN_TRANSIT]: 'In Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
}

export const statusActionLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Mark as received',
  [OrderStatus.CONFIRMED]: 'Confirm Order',
  [OrderStatus.PREPARING]: 'Start Preparation',
  [OrderStatus.READY]: 'Mark as ready',
  [OrderStatus.IN_TRANSIT]: 'Send in Delivery',
  [OrderStatus.DELIVERED]: 'Mark as delivered',
  [OrderStatus.CANCELLED]: 'Cancel Order',
}

export const orderActionLabels = {
  actionsMenuTitle: 'Actions',
  changeStatusGroup: 'Change Status',
  viewDetails: 'View Details',
  deleteOrder: 'Delete Order',
  openMenuSr: 'Open Menu',
} as const

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.PENDING]: {
      label: orderStatusLabels[OrderStatus.PENDING],
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.CONFIRMED]: {
      label: orderStatusLabels[OrderStatus.CONFIRMED],
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.PREPARING]: {
      label: orderStatusLabels[OrderStatus.PREPARING],
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.READY]: {
      label: orderStatusLabels[OrderStatus.READY],
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.IN_TRANSIT]: {
      label: orderStatusLabels[OrderStatus.IN_TRANSIT],
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.DELIVERED]: {
      label: orderStatusLabels[OrderStatus.DELIVERED],
      className: 'text-on-surface-variant bg-surface-container-highest',
    },
    [OrderStatus.CANCELLED]: {
      label: orderStatusLabels[OrderStatus.CANCELLED],
      className: 'text-error bg-error/10',
    },
  }

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'text-on-surface-variant bg-surface-container-highest',
  }

  return (
    <span
      className={`font-label-caps text-[10px] tracking-[0.2em] px-3 py-1 rounded-full uppercase ${config.className}`}
    >
      {config.label}
    </span>
  )
}
