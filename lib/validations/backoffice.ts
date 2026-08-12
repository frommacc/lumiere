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
  name: z.string().min(1, 'Name is mandatory'),
  slug: z.string().min(1, 'Slug is a must'),
  description: z.string().nullable().optional(),
  displayOrder: z.number(),
  isPublished: z.boolean().default(true),
  image: z.string().nullable().optional(),
  imageId: z.string().nullable().optional(),
  imageFile: z
    .custom<File>((val) => val instanceof File)
    .optional()
    .nullable(),
})

export const subcategorySchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, 'Select Category'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isPublished: z.boolean().default(true),
})

export type SubcategoryFormValues = z.infer<typeof subcategorySchema>

export const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  image: z.string().nullable().optional(),
  imageId: z.string().nullable().optional(),
  imageFile: z.instanceof(File).optional(),

  // Selection
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),

  // Flags
  isAvailable: z.boolean().default(true),
  isOrderable: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
  isSpecial: z.boolean().default(false),

  // Additional details
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  dietary: z.array(z.string()).default([]),

  origin: z.string().nullable().optional(),
  preparation: z.string().nullable().optional(),
  pairing: z.string().nullable().optional(),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>
