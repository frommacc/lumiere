import { ROLE_NAVIGATION, type RoleNavLink } from '@/lib/constants/access-control'

export type NavLinkItem = RoleNavLink

export const NAV_LINKS = [
  { label: 'Specijaliteti', href: '/#specialties' },
  { label: 'Meni', href: '/menu' },
  { label: 'Za nas', href: '/#about' },
  { label: 'Preporaki', href: '/#reviews' },
  { label: 'Kontakt', href: '/#contact' },
]

export const MANAGEMENT_LINKS = ROLE_NAVIGATION.MANAGER
export const KITCHEN_LINKS = ROLE_NAVIGATION.KITCHEN
export const STAFF_LINKS = ROLE_NAVIGATION.STAFF
export const USER_LINKS = ROLE_NAVIGATION.USER
