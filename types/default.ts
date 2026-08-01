import { MenuItemWithRelations } from './menu-item'

export interface CartMenuItem {
  id: string
  name: string
  price: number
  image: string
}

export interface CartItem {
  menuItem: CartMenuItem
  quantity: number
  notes?: string
}

export function toCartMenuItem(item: MenuItemWithRelations): CartMenuItem {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
  }
}

export type TableType = 'standard' | 'window' | 'vip_lounge' | 'outdoor'

export interface Reservation {
  date: string
  time: string
  guests: number
  name: string
  phone: string
  email: string
  tableType: TableType
  specialRequests?: string
}
