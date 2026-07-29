import { MenuItem } from '@/lib/generated/prisma'

export interface MenuItemWithCategory extends MenuItem {
  category: {
    name: string
  }
}
