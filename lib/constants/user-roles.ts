import { Role } from '../generated/prisma'

export interface RoleConfig {
  label: string
  shortLabel: string
  description: string
  badgeStyle: string
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  USER: {
    label: 'Гост / Клиент',
    shortLabel: 'Клиент',
    description: 'Обичен корисник кој прави нарачки и резервации.',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  STAFF: {
    label: 'Келнер / Сервис',
    shortLabel: 'Персонал',
    description: 'Персонал кој ги услужува масите и прима резервации.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  KITCHEN: {
    label: 'Кујна / Шанк',
    shortLabel: 'Кујна',
    description: 'Тим во кујна кој ги подготвува нарачаните јадења.',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  MANAGER: {
    label: 'Менаџер',
    shortLabel: 'Менаџер',
    description: 'Управува со менито, цените, масите и дневните извештаи.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  ADMIN: {
    label: 'Администратор',
    shortLabel: 'Админ',
    description: 'Сопственик со целосен пристап до сите поставки и корисници.',
    badgeStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
}

// Помошни функции
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

// Речник за брз пристап до кратки ознаки
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: getRoleLabel('ADMIN', true),
  MANAGER: getRoleLabel('MANAGER', true),
  KITCHEN: getRoleLabel('KITCHEN', true),
  STAFF: getRoleLabel('STAFF', true),
  USER: getRoleLabel('USER', true),
}
