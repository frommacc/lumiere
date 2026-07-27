import { OrderStatus } from '@/lib/generated/prisma'

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.PENDING]: {
      label: 'Примена',
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.CONFIRMED]: {
      label: 'Потврдена',
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.PREPARING]: {
      label: 'Во подготовка',
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.READY]: {
      label: 'Подготвена',
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.IN_TRANSIT]: {
      label: 'Во испорака',
      className: 'text-primary bg-primary/10',
    },
    [OrderStatus.DELIVERED]: {
      label: 'Доставено',
      className: 'text-on-surface-variant bg-surface-container-highest',
    },
    [OrderStatus.CANCELLED]: {
      label: 'Откажано',
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
