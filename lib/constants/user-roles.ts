import { Role } from '../generated/prisma'

export interface RoleConfig {
  label: string
  shortLabel: string
  description: string
  badgeStyle: string
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  USER: {
    label: 'Guest / Client',
    shortLabel: 'Client',
    description: 'Ordinary user who makes orders and reservations.',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  STAFF: {
    label: 'Waiter / Service',
    shortLabel: 'Staff',
    description: 'Staff serving tables and taking reservations.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  KITCHEN: {
    label: 'Kitchen / Bar',
    shortLabel: 'Kitchen',
    description: 'Kitchen team preparing the ordered dishes.',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  MANAGER: {
    label: 'Manager',
    shortLabel: 'Manager',
    description: 'Manages the menu, prices, tables and daily reports.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  ADMIN: {
    label: 'Administrator',
    shortLabel: 'Admin',
    description: 'Owner with full access to all settings and users.',
    badgeStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
}

// Helper functions
export function getRoleLabel(role: Role, short = false): string {
  const config = ROLE_CONFIG[role]
  if (!config) return role
  return short ? config.shortLabel : config.label
}

export function getRoleDescription(role: Role): string {
  return ROLE_CONFIG[role]?.description || ''
}

export function getRoleBadgeStyle(role: Role): string {
  return ROLE_CONFIG[role]?.badgeStyle || ''
}

// Dictionary for quick access to short tags
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: getRoleLabel('ADMIN', true),
  MANAGER: getRoleLabel('MANAGER', true),
  KITCHEN: getRoleLabel('KITCHEN', true),
  STAFF: getRoleLabel('STAFF', true),
  USER: getRoleLabel('USER', true),
}
