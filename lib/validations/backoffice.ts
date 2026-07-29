import { z } from 'zod'

export const orderStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
])

export const reservationStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'SEATED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
])

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: orderStatusSchema,
})

export const updateReservationStatusSchema = z.object({
  reservationId: z.string().min(1),
  status: reservationStatusSchema,
})

export const updateReviewModerationSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(['APPROVED', 'REJECTED']),
})

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['USER', 'STAFF', 'KITCHEN', 'MANAGER', 'ADMIN']),
})

export const tableTypeSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(240).optional(),
})

export const tableSchema = z.object({
  id: z.string().min(1).optional(),
  number: z.string().trim().min(1).max(24),
  capacity: z.coerce.number().int().min(1).max(30),
  tableTypeId: z.string().min(1),
})

export const categorySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(240).optional(),
  image: z.string().url(),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
})

export const menuItemSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(1000),
  price: z.coerce.number().int().min(1).max(1_000_000),
  image: z.string().url(),
  categoryId: z.string().min(1),
  isPopular: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isSpecial: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})
