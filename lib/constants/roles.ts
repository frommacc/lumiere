import { Role } from '../generated/prisma'

export interface RoleConfig {
  label: string
  description: string
  badgeStyle: string
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  USER: {
    label: 'Гост / Клиент',
    description: 'Обичен корисник кој прави нарачки и резервации.',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  STAFF: {
    label: 'Келнер / Сервис',
    description: 'Персонал кој ги услужува масите и прима резервации.',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  KITCHEN: {
    label: 'Кујна / Шанк',
    description: 'Тим во кујна кој ги подготвува нарачаните јадења.',
    badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  MANAGER: {
    label: 'Менаџер',
    description: 'Управува со менито, цените, масите и дневните извештаи.',
    badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  ADMIN: {
    label: 'Администратор',
    description: 'Сопственик со целосен пристап до сите поставки и корисници.',
    badgeStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
}

// Помошни функции
export function getRoleLabel(role: Role): string {
  return ROLE_CONFIG[role]?.label || role
}

export function getRoleDescription(role: Role): string {
  return ROLE_CONFIG[role]?.description || ''
}
