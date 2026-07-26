// components/ui/RoleBadge.tsx
import { ROLE_CONFIG } from '@/lib/constants/user-roles'
import { Role } from '@/lib/generated/prisma'

interface RoleBadgeProps {
  role: Role
  showDescription?: boolean
}

export function RoleBadge({ role, showDescription = false }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] || {
    label: role,
    description: '',
    badgeStyle: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }

  return (
    <div className='inline-flex flex-col gap-1'>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeStyle}`}
      >
        <span className='w-1.5 h-1.5 rounded-full bg-current' />
        {config.label}
      </span>
      {showDescription && (
        <span className='text-xs text-slate-400'>{config.description}</span>
      )}
    </div>
  )
}
