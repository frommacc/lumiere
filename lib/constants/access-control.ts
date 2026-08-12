import {
  CalendarDays,
  ChefHat,
  ClipboardList,
  Layers,
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
  { href: '/admin/dashboard', label: 'Control Panel', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', Icon: Receipt },
  { href: '/admin/reservations', label: 'Reservations', Icon: CalendarDays },
  { href: '/admin/tables', label: 'Tables', Icon: TableProperties },
  { href: '/admin/menu', label: 'Menu', Icon: UtensilsCrossed },
  { href: '/admin/menu/categories', label: 'Menu Categories', Icon: Layers },
  { href: '/admin/reviews', label: 'Reviews', Icon: Star },
]

export const ROLE_NAVIGATION: Record<Role, RoleNavLink[]> = {
  USER: [
    { href: '/profile', label: 'My Profile', Icon: Users },
    {
      href: '/profile/reservations',
      label: 'My bookings',
      Icon: CalendarDays,
    },
    { href: '/profile/orders', label: 'My Orders', Icon: ShoppingBag },
  ],
  STAFF: [
    { href: '/staff/tables', label: 'Active Tables', Icon: ClipboardList },
    {
      href: '/staff/reservations',
      label: "Today's bookings",
      Icon: CalendarDays,
    },
    { href: '/staff/orders', label: 'Delivering orders', Icon: ShoppingBag },
  ],
  KITCHEN: [{ href: '/kitchen/orders', label: 'Kitchen Screen', Icon: ChefHat }],
  MANAGER: MANAGEMENT_LINKS,
  ADMIN: [
    ...MANAGEMENT_LINKS,
    { href: '/admin/users', label: 'Users', Icon: Users },
  ],
}

const routeRules : Array<{ prefix: string; roles: Role[] }> = [
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

export function canAccessPath(
  role: Role | string | null | undefined,
  pathname: string,
) {
  const rule = routeRules.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  return !rule || rule.roles.includes(role as Role)
}

export function hasAnyRole(
  role: Role | string | null | undefined,
  roles: Role[],
) {
  return roles.includes(role as Role)
}

export const MANAGEMENT_ROLES = [Role.ADMIN, Role.MANAGER] as const
