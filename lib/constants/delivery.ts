import { DeliveryMethod } from '../generated/prisma'

export const DELIVERY_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 500,
  STANDARD_DELIVERY_FEE: 100,
} as const

export const calculateDeliveryFee = (
  itemsTotal: number,
  method: DeliveryMethod,
): number => {
  if (method === 'PICKUP') {
    return 0
  }

  if (itemsTotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) {
    return 0
  }

  return DELIVERY_CONFIG.STANDARD_DELIVERY_FEE
}
