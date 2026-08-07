import {
  DeliveryMethod,
  OrderStatus,
  ReservationStatus,
  Role,
} from '@/lib/generated/prisma'

const managerOrderTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
  READY: [OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  IN_TRANSIT: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  DELIVERED: [],
  CANCELLED: [],
}

const managerReservationTransitions: Record<
  ReservationStatus,
  ReservationStatus[]
> = {
  PENDING: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED],
  CONFIRMED: [
    ReservationStatus.SEATED,
    ReservationStatus.CANCELLED,
    ReservationStatus.NO_SHOW,
  ],
  SEATED: [ReservationStatus.COMPLETED, ReservationStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export function getAllowedOrderStatuses(
  role: Role,
  current: OrderStatus,
  deliveryMethod: DeliveryMethod,
) {
  if (role === Role.ADMIN) {
    return Object.values(OrderStatus).filter((status) => status !== current)
  }

  if (role === Role.MANAGER) {
    return managerOrderTransitions[current]
  }
  if (role === Role.KITCHEN) {
    if (current === OrderStatus.PENDING) return [OrderStatus.CONFIRMED]
    if (current === OrderStatus.CONFIRMED) return [OrderStatus.PREPARING]
    if (current === OrderStatus.PREPARING) return [OrderStatus.READY]
    return []
  }
  if (role === Role.STAFF) {
    if (current === OrderStatus.READY) {
      return deliveryMethod === DeliveryMethod.PICKUP
        ? [OrderStatus.DELIVERED]
        : [OrderStatus.IN_TRANSIT]
    }
    return current === OrderStatus.IN_TRANSIT ? [OrderStatus.DELIVERED] : []
  }
  return []
}

export function getAllowedReservationStatuses(
  role: Role,
  current: ReservationStatus,
) {
  if (role === Role.ADMIN || role === Role.MANAGER) {
    return managerReservationTransitions[current]
  }
  if (role === Role.STAFF) {
    if (current === ReservationStatus.CONFIRMED) {
      return [ReservationStatus.SEATED, ReservationStatus.NO_SHOW]
    }
    return current === ReservationStatus.SEATED
      ? [ReservationStatus.COMPLETED]
      : []
  }
  return []
}
