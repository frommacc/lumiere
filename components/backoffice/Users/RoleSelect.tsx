'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_CONFIG } from '@/lib/constants/user-roles'
import { Role } from '@/lib/generated/prisma'

// Автоматски ги генерираме опциите за компонентата од ROLE_CONFIG
const ROLE_OPTIONS = (Object.keys(ROLE_CONFIG) as Role[]).map((role) => ({
  value: role,
  label: `${ROLE_CONFIG[role].label} (${role})`, // Или користи ROLE_CONFIG[role].shortLabel по желба
}))

export function RoleSelect() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const selectedRole = searchParams.get('role') ?? 'ALL'

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    params.set('page', '1')

    if (value && value !== 'ALL') {
      params.set('role', value)
    } else {
      params.delete('role')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={selectedRole} onValueChange={handleRoleChange}>
      <SelectTrigger className='w-50'>
        <SelectValue placeholder='Сите улоги' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ALL'>Сите улоги</SelectItem>
        {ROLE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
