import { Prisma } from '@/lib/generated/prisma'

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: { menuItems: true }
    }
  }
}>

export type SubcategoryWithRelations = Prisma.SubcategoryGetPayload<{
  include: {
    category: {
      select: { id: true; name: true }
    }
    _count: {
      select: { menuItems: true }
    }
  }
}>
