'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, KeyRound, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/lib/validations/change-password'
import { useChangePasswordStore } from '@/store/useChangePasswordStore'
import { useState } from 'react'

export function ChangePasswordModal() {
  const { isOpen, close } = useChangePasswordStore()
  const [isPending, startTransition] = useTransition()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const handleClose = () => {
    form.reset()
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    close()
  }

  const onSubmit = (values: ChangePasswordValues) => {
    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        const message =
          error.code === 'INVALID_PASSWORD'
            ? 'Тековната лозинка не е точна.'
            : error.message || 'Не успеавме да ја промениме лозинката. Обидете се повторно.'
        form.setError('currentPassword', { message })
        toast.error(message)
        return
      }

      toast.success('Лозинката е успешно променета. Другите активни сесии се одјавени.')
      handleClose()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-md'>
        <DialogHeader className='text-left'>
          <DialogTitle className='flex items-center gap-2 font-display text-3xl'>
            <KeyRound className='size-7 text-primary' />
            Промени лозинка
          </DialogTitle>
          <DialogDescription className='text-on-surface-variant'>
            Внесете ја тековната лозинка, потоа изберете нова безбедна лозинка.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5' noValidate>
          <PasswordField
            id='current-password'
            label='Тековна лозинка'
            autoComplete='current-password'
            show={showCurrentPassword}
            onToggle={() => setShowCurrentPassword((value) => !value)}
            error={form.formState.errors.currentPassword?.message}
            disabled={isPending}
            registration={form.register('currentPassword')}
          />
          <PasswordField
            id='new-password'
            label='Нова лозинка'
            autoComplete='new-password'
            show={showNewPassword}
            onToggle={() => setShowNewPassword((value) => !value)}
            error={form.formState.errors.newPassword?.message}
            disabled={isPending}
            registration={form.register('newPassword')}
          />
          <PasswordField
            id='confirm-password'
            label='Потврди нова лозинка'
            autoComplete='new-password'
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
            error={form.formState.errors.confirmPassword?.message}
            disabled={isPending}
            registration={form.register('confirmPassword')}
          />

          <div className='flex justify-end gap-3 border-t border-outline-variant/20 pt-5'>
            <Button type='button' variant='outline' onClick={handleClose} disabled={isPending}>
              Откажи
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <LoaderCircle className='animate-spin' />}
              Зачувај лозинка
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PasswordField({
  id,
  label,
  autoComplete,
  show,
  onToggle,
  error,
  disabled,
  registration,
}: {
  id: string
  label: string
  autoComplete: string
  show: boolean
  onToggle: () => void
  error?: string
  disabled: boolean
  registration: ReturnType<typeof useForm<ChangePasswordValues>>['register'] extends (
    name: infer Name,
  ) => infer Registration
    ? Registration
    : never
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          className='pr-11'
          {...registration}
        />
        <button
          type='button'
          onClick={onToggle}
          disabled={disabled}
          className='absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-50'
          aria-label={show ? 'Скриј лозинка' : 'Прикажи лозинка'}
        >
          {show ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  )
}
