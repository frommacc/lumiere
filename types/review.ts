import { Prisma } from '@/lib/generated/prisma'

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        image: true
        name: true
      }
    }
  }
}>
