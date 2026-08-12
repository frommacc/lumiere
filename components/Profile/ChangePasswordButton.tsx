'use client'

import { KeyRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useChangePasswordStore } from '@/store/useChangePasswordStore'

export function ChangePasswordButton({ compact = false }: { compact?: boolean }) {
  const open = useChangePasswordStore((state) => state.open)

  return (
    <Button
      type='button'
      variant={compact ? 'ghost' : 'outline'}
      onClick={open}
      className={compact
        ? 'h-auto px-0 text-primary hover:bg-transparent hover:text-primary/75'
        : 'border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground'}
    >
      <KeyRound />      Change password</Button>
  )
}
