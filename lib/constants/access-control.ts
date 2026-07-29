import {
  CalendarDays,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Star,
  TableProperties,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

import { Role } from '@/lib/generated/prisma'

export type RoleNavLink = {
  href: string
  label: string
  Icon: LucideIcon
}

export const ROLE_HOME: Record<Role, string> = {
  USER: '/profile',
  STAFF: '/staff/tables',
  KITCHEN: '/kitchen/orders',
  MANAGER: '/admin/dashboard',
  ADMIN: '/admin/dashboard',
}

const MANAGEMENT_LINKS: RoleNavLink[] = [
  { href: '/admin/dashboard', label: 'Контролна табла', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Нарачки', Icon: Receipt },
  { href: '/admin/reservations', label: 'Резервации', Icon: CalendarDays },
  { href: '/admin/tables', label: 'Маси', Icon: TableProperties },
  { href: '/admin/menu', label: 'Мени', Icon: UtensilsCrossed },
  { href: '/admin/reviews', label: 'Рецензии', Icon: Star },
]

export const ROLE_NAVIGATION: Record<Role, RoleNavLink[]> = {
  USER: [
    { href: '/profile', label: 'Мој профил', Icon: Users },
    { href: '/profile/reservations', label: 'Мои резервации', Icon: CalendarDays },
    { href: '/profile/orders', label: 'Мои нарачки', Icon: ShoppingBag },
  ],
  STAFF: [
    { href: '/staff/tables', label: 'Активни маси', Icon: ClipboardList },
    { href: '/staff/reservations', label: 'Денешни резервации', Icon: CalendarDays },
    { href: '/staff/orders', label: 'Предавање нарачки', Icon: ShoppingBag },
  ],
  KITCHEN: [
    { href: '/kitchen/orders', label: 'Кујнски екран', Icon: ChefHat },
  ],
  MANAGER: MANAGEMENT_LINKS,
  ADMIN: [
    ...MANAGEMENT_LINKS,
    { href: '/admin/users', label: 'Корисници', Icon: Users },
  ],
}

const routeRules: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: '/admin/users', roles: [Role.ADMIN] },
  { prefix: '/admin', roles: [Role.ADMIN, Role.MANAGER] },
  { prefix: '/kitchen', roles: [Role.ADMIN, Role.MANAGER, Role.KITCHEN] },
  { prefix: '/staff', roles: [Role.ADMIN, Role.MANAGER, Role.STAFF] },
  {
    prefix: '/profile',
    roles: [Role.USER, Role.STAFF, Role.KITCHEN, Role.MANAGER, Role.ADMIN],
  },
]

export function getRoleHome(role: Role | string | null | undefined) {
  return ROLE_HOME[role as Role] ?? ROLE_HOME.USER
}

export function getRoleNavigation(role: Role | string | null | undefined) {
  return ROLE_NAVIGATION[role as Role] ?? ROLE_NAVIGATION.USER
}

export function canAccessPath(role: Role | string | null | undefined, pathname: string) {
  const rule = routeRules.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  return !rule || rule.roles.includes(role as Role)
}

export function hasAnyRole(role: Role | string | null | undefined, roles: Role[]) {
  return roles.includes(role as Role)
}

export const MANAGEMENT_ROLES = [Role.ADMIN, Role.MANAGER] as const
