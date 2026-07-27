'use client'

import { MessageSquarePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useReviewStore } from '@/store/useReviewStore'

export function ReviewButton({ compact = false }: { compact?: boolean }) {
  const open = useReviewStore((state) => state.open)

  return (
    <Button
      type='button'
      variant={compact ? 'outline' : 'default'}
      onClick={open}
      className={compact ? 'border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground' : ''}
    >
      <MessageSquarePlus />
      Остави review
    </Button>
  )
}
