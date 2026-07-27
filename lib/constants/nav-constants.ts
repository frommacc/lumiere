import {
  LayoutDashboard,
  CalendarDays,
  Receipt,
  UtensilsCrossed,
  ChefHat,
  ClipboardList,
  UserCircle,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react'

export interface NavLinkItem {
  href: string
  label: string
  Icon: LucideIcon
}

// 1. Главни навигациски линкови на страницата
export const NAV_LINKS = [
  { label: 'Специјалитети', href: '/#specialties' },
  { label: 'Мени', href: '/menu' },
  { label: 'За Нас', href: '/#about' },
  { label: 'Препораки', href: '/#reviews' },
  { label: 'Контакт', href: '/#contact' },
]

// 2. Сите групирани линкови по улоги
export const MANAGEMENT_LINKS: NavLinkItem[] = [
  { href: '/admin/dashboard', label: 'Дашборд', Icon: LayoutDashboard },
  { href: '/admin/reservations', label: 'Резервации', Icon: CalendarDays },
  { href: '/admin/orders', label: 'Нарачки', Icon: Receipt },
  { href: '/admin/menu', label: 'Мени & Јадења', Icon: UtensilsCrossed },
]

export const KITCHEN_LINKS: NavLinkItem[] = [
  { href: '/kitchen/orders', label: 'Кујнски Екран', Icon: ChefHat },
]

export const STAFF_LINKS: NavLinkItem[] = [
  { href: '/staff/tables', label: 'Активни Маси', Icon: ClipboardList },
  {
    href: '/staff/reservations',
    label: 'Денешни Резервации',
    Icon: CalendarDays,
  },
]

export const USER_LINKS: NavLinkItem[] = [
  { href: '/profile', label: 'Мој Профил', Icon: UserCircle },
  {
    href: '/profile/reservations',
    label: 'Мои Резервации',
    Icon: CalendarDays,
  },
  { href: '/profile/orders', label: 'Мои Нарачки', Icon: ShoppingBag },
]
