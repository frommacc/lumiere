import { OrderStatus } from '@/lib/generated/prisma'

export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Примена',
  [OrderStatus.CONFIRMED]: 'Потврдена',
  [OrderStatus.PREPARING]: 'Во подготовка',
  [OrderStatus.READY]: 'Подготвена',
  [OrderStatus.IN_TRANSIT]: 'Во испорака',
  [OrderStatus.DELIVERED]: 'Доставено',
  [OrderStatus.CANCELLED]: 'Откажано',
}

export const statusActionLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Означи како примена',
  [OrderStatus.CONFIRMED]: 'Потврди нарачка',
  [OrderStatus.PREPARING]: 'Започни подготовка',
  [OrderStatus.READY]: 'Означи како подготвена',
  [OrderStatus.IN_TRANSIT]: 'Испрати во испорака',
  [OrderStatus.DELIVERED]: 'Означи како доставена',
  [OrderStatus.CANCELLED]: 'Откажи нарачка',
}

export const orderActionLabels = {
  actionsMenuTitle: 'Акции',
  changeStatusGroup: 'Промени статус',
  viewDetails: 'Види детали',
  deleteOrder: 'Избриши нарачка',
  openMenuSr: 'Отвори мени',
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
