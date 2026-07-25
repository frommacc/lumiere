'use client'

import { ROLE_CONFIG } from '@/lib/constants/roles'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Role } from '@/lib/generated/prisma'

interface RoleSelectProps {
  value: Role
  onChange: (newRole: Role) => void
  disabled?: boolean
}

export function RoleSelect({
  value,
  onChange,
  disabled = false,
}: RoleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as Role)}
      disabled={disabled}
    >
      <SelectTrigger className='w-55 bg-slate-900 border-slate-800 text-white'>
        <SelectValue placeholder='Избери улога'>
          {value && (
            <div className='flex items-center gap-2'>
              <span
                className={`w-2 h-2 rounded-full border ${ROLE_CONFIG[value]?.badgeStyle}`}
              />
              <span>{ROLE_CONFIG[value]?.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className='bg-slate-900 border-slate-800 text-white'>
        {(Object.keys(ROLE_CONFIG) as Role[]).map((roleKey) => {
          const config = ROLE_CONFIG[roleKey]
          return (
            <SelectItem
              key={roleKey}
              value={roleKey}
              className='focus:bg-slate-800 focus:text-white cursor-pointer py-2.5'
            >
              <div className='flex flex-col gap-0.5'>
                <div className='flex items-center gap-2 font-medium'>
                  <span
                    className={`w-2 h-2 rounded-full border ${config.badgeStyle}`}
                  />
                  {config.label}
                </div>
                <span className='text-xs text-slate-400 pl-4'>
                  {config.description}
                </span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
