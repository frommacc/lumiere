'use client'

import { useTransition } from 'react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Role } from '@/lib/generated/prisma'
import { getRoleLabel } from '@/lib/constants/user-roles'
import { updateUserRoleAction } from '@/actions/backoffice/users'

export function UserRoleControl({
  userId,
  role,
  disabled = false,
}: {
  userId: string
  role: Role
  disabled?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className='flex items-center gap-2'>
      <Select
        value={role}
        disabled={disabled || pending}
        onValueChange={(nextRole) =>
          startTransition(async () => {
            const result = await updateUserRoleAction({
              userId,
              role: nextRole,
            })
            if (result.success) toast.success(result.message)
            else toast.error(result.message)
            if (result.success) router.refresh()
          })
        }
      >
        <SelectTrigger className='w-40 border-outline-variant/30 bg-surface-container-high text-xs'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='border-outline-variant/30 bg-surface-container text-on-surface'>
          {Object.values(Role).map((value) => (
            <SelectItem key={value} value={value}>
              {getRoleLabel(value, true)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending ? (
        <LoaderCircle className='size-4 animate-spin text-primary' />
      ) : null}
    </div>
  )
}
