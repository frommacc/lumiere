import {
  ROLE_NAVIGATION,
  type RoleNavLink,
} from '@/lib/constants/access-control'

export type NavLinkItem = RoleNavLink

export const NAV_LINKS = [
  { label: 'Specialties', href: '/#specialties' },
  { label: 'Menu', href: '/menu' },
  { label: 'For us', href: '/#about' },
  { label: 'Recommendations', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
]

export const MANAGEMENT_LINKS = ROLE_NAVIGATION.MANAGER
export const KITCHEN_LINKS = ROLE_NAVIGATION.KITCHEN
export const STAFF_LINKS = ROLE_NAVIGATION.STAFF
export const USER_LINKS = ROLE_NAVIGATION.USER
