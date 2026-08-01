import { getMenuItems } from '@/lib/db/menu-items.services'
import { MenuItem, Prisma } from '@/lib/generated/prisma'

export interface MenuItemWithCategory extends MenuItem {
  category: {
    name: string
  }
}

export type MenuItemsWithRelations = Prisma.PromiseReturnType<
  typeof getMenuItems
>

export type MenuItemWithRelations = MenuItemsWithRelations[number]
