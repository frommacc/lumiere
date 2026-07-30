import {
  ROLE_NAVIGATION,
  type RoleNavLink,
} from '@/lib/constants/access-control'

export type NavLinkItem = RoleNavLink

export const NAV_LINKS = [
  { label: 'Специјалитети', href: '/#specialties' },
  { label: 'Мени', href: '/menu' },
  { label: 'За нас', href: '/#about' },
  { label: 'Препораки', href: '/#reviews' },
  { label: 'Контакт', href: '/#contact' },
]

export const MANAGEMENT_LINKS = ROLE_NAVIGATION.MANAGER
export const KITCHEN_LINKS = ROLE_NAVIGATION.KITCHEN
export const STAFF_LINKS = ROLE_NAVIGATION.STAFF
export const USER_LINKS = ROLE_NAVIGATION.USER
