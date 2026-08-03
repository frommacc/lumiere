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
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(240).optional(),
})

export const tableSchema = z.object({
  id: z.string().min(1).optional(),
  number: z.string().trim().min(1).max(24),
  capacity: z.coerce.number().int().min(1).max(30),
  tableTypeId: z.string().min(1),
})

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Името е задолжително'),
  slug: z.string().min(1, 'Slug е задолжителен'),
  description: z.string().nullable().optional(),
  displayOrder: z.number(),
  image: z.string().nullable().optional(),
  imageId: z.string().nullable().optional(),
  imageFile: z
    .custom<File>((val) => val instanceof File)
    .optional()
    .nullable(),
})

export const subcategorySchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, 'Изберете категорија'),
  name: z.string().min(1, 'Името е задолжително'),
  slug: z.string().min(1, 'Слагот е задолжителен'),
  description: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
})

export type SubcategoryFormValues = z.infer<typeof subcategorySchema>

export const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Името е задолжително'),
  description: z.string().min(1, 'Описот е задолжителен'),
  price: z.number().min(0, 'Цената мора да биде позитивен број'),
  image: z.string().nullable().optional(),
  imageId: z.string().nullable().optional(),
  imageFile: z.instanceof(File).optional(),

  // Селекција
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),

  // Знаменца
  isAvailable: z.boolean().default(true),
  isOrderable: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isSpecial: z.boolean().default(false),

  // Дополнителни детали
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),

  origin: z.string().nullable().optional(),
  preparation: z.string().nullable().optional(),
  pairing: z.string().nullable().optional(),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>
