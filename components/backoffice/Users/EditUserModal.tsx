'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoaderCircle, UserPen } from 'lucide-react'

import { Role, UserStatus } from '@/lib/generated/prisma'
import { getRoleLabel } from '@/lib/constants/user-roles'
import { updateAdminUserAction } from '@/actions/backoffice/users'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: UserStatus
}

interface EditUserModalProps {
  user: UserData
  isSelf: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserModal({
  user,
  isSelf,
  open,
  onOpenChange,
}: EditUserModalProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    role: user.role,
    status: user.status,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await updateAdminUserAction({
        userId: user.id,
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      })

      if (res.success) {
        toast.success(res.message)
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-surface-container text-on-surface sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <UserPen className='size-5 text-primary' /> Уреди кориснички профил
          </DialogTitle>
          <DialogDescription className='text-xs text-on-surface-variant'>
            Измената на е-поштата и аватарот не се дозволени од овој панел.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-2'>
          {/* Име и презиме */}
          <div className='space-y-1.5'>
            <Label htmlFor='name' className='text-xs font-medium'>
              Име и презиме
            </Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Внесете име'
              required
              className='bg-surface-container-high border-outline-variant/30 text-sm'
            />
          </div>

          {/* Е-пошта (Disabled) */}
          <div className='space-y-1.5'>
            <Label htmlFor='email' className='text-xs font-medium opacity-70'>
              Е-пошта (не може да се менува)
            </Label>
            <Input
              id='email'
              value={user.email}
              disabled
              className='bg-surface-container-low border-outline-variant/20 opacity-60 text-sm cursor-not-allowed'
            />
          </div>

          {/* Телефонски број */}
          <div className='space-y-1.5'>
            <Label htmlFor='phone' className='text-xs font-medium'>
              Телефонски број
            </Label>
            <Input
              id='phone'
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder='+389 7X XXX XXX'
              required
              className='bg-surface-container-high border-outline-variant/30 text-sm'
            />
          </div>

          {/* Грид за Улога и Статус */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {/* Работна улога */}
            <div className='space-y-1.5'>
              <Label className='text-xs font-medium'>Работна улога</Label>
              <Select
                value={formData.role}
                disabled={isSelf}
                onValueChange={(val: Role) =>
                  setFormData({ ...formData, role: val })
                }
              >
                <SelectTrigger className='w-full border-outline-variant/30 bg-surface-container-high text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-surface-container border-outline-variant/30'>
                  {Object.values(Role).map((value) => (
                    <SelectItem key={value} value={value} className='text-xs'>
                      {getRoleLabel(value, true)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Статус */}
            <div className='space-y-1.5'>
              <Label className='text-xs font-medium'>Статус на сметка</Label>
              <Select
                value={formData.status}
                disabled={isSelf}
                onValueChange={(val: UserStatus) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className='w-full border-outline-variant/30 bg-surface-container-high text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-surface-container border-outline-variant/30'>
                  <SelectItem
                    value={UserStatus.ACTIVE}
                    className='text-xs text-emerald-600'
                  >
                    Активен
                  </SelectItem>
                  <SelectItem
                    value={UserStatus.BLOCKED}
                    className='text-xs text-destructive'
                  >
                    Блокиран
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='pt-4 gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Откажи
            </Button>
            <Button type='submit' disabled={pending}>
              {pending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
              Зачувај промени
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
