import { prisma } from '@/lib/prisma'

type ProfileUserUpdate = {
  name: string
  phone: string
  image?: string
  imageId?: string
}

export async function getProfileUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      role: true,
    },
  })
}

export async function getUserProfileImage(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      imageId: true,
    },
  })
}

export async function updateProfileUser(
  userId: string,
  data: ProfileUserUpdate,
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      name: true,
      phone: true,
      image: true,
    },
  })
}
