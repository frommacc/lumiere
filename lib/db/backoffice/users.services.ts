import { Prisma, Role } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

export async function getAdminUsers(
  query?: string,
  role?: Role,
  page: number = 1,
  pageSize: number = 10,
) {
  const term = query?.trim()

  // Типизиран where објект
  const where: Prisma.UserWhereInput = {}

  if (term) {
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { phone: { contains: term, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    users,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  }
}
