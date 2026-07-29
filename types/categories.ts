import { Prisma } from '@/lib/generated/prisma'

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: { menuItems: true }
    }
  }
}>
