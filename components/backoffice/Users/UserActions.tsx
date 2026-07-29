'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  MoreHorizontal,
  Pencil,
  Ban,
  CheckCircle2,
  Trash2,
  LoaderCircle,
} from 'lucide-react'

import { User, UserStatus } from '@/lib/generated/prisma'
import { updateUserStatusAction } from '@/actions/backoffice/users'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserActionsProps {
  user: User
  isSelf: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserActions({
  user,
  isSelf,
  onEdit,
  onDelete,
}: UserActionsProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Брза акција: Блокирај / Активирај
  const handleToggleStatus = () => {
    const nextStatus =
      user.status === UserStatus.BLOCKED
        ? UserStatus.ACTIVE
        : UserStatus.BLOCKED

    startTransition(async () => {
      const res = await updateUserStatusAction({
        userId: user.id,
        status: nextStatus,
      })
      if (res.success) {
        toast.success(res.message)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={pending}
          className='size-8 p-0 text-on-surface-variant hover:text-on-surface'
        >
          {pending ? (
            <LoaderCircle className='size-4 animate-spin' />
          ) : (
            <MoreHorizontal className='size-4' />
          )}
          <span className='sr-only'>Отвори мени</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-48 border-outline-variant/20 bg-surface-container text-on-surface'
      >
        <DropdownMenuLabel className='text-xs font-normal text-on-surface-variant'>
          Акции за корисник
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-outline-variant/15' />

        {/* Известува табелата кој корисник се уредува */}
        <DropdownMenuItem
          onClick={() => onEdit(user)}
          className='cursor-pointer text-xs'
        >
          <Pencil className='mr-2 size-3.5' />
          Уреди корисник
        </DropdownMenuItem>

        {/* Блокирај / Активирај */}
        <DropdownMenuItem
          disabled={isSelf}
          onClick={handleToggleStatus}
          className='cursor-pointer text-xs'
        >
          {user.status === UserStatus.BLOCKED ? (
            <>
              <CheckCircle2 className='mr-2 size-3.5 text-emerald-500' />
              Активирај корисник
            </>
          ) : (
            <>
              <Ban className='mr-2 size-3.5 text-amber-500' />
              Блокирај корисник
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className='bg-outline-variant/15' />

        {/* Известува за бришење */}
        <DropdownMenuItem
          disabled={isSelf}
          onClick={() => onDelete(user)}
          className='cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive'
        >
          <Trash2 className='mr-2 size-3.5' />
          Избриши корисник
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
