'use client'

import { useTransition } from 'react'
import { Check, LoaderCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { moderateReviewAction } from '@/actions/backoffice'
import { Button } from '@/components/ui/button'

export function ReviewActions({ reviewId }: { reviewId: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const moderate = (status: 'APPROVED' | 'REJECTED') => startTransition(async () => {
    const result = await moderateReviewAction({ reviewId, status })
    if (result.success) toast.success(result.message)
    else toast.error(result.message)
    if (result.success) router.refresh()
  })

  return (
    <div className='flex gap-2'>
      <Button type='button' size='sm' disabled={pending} onClick={() => moderate('APPROVED')}>
        {pending ? <LoaderCircle className='size-3.5 animate-spin' /> : <Check className='size-3.5' />}
        Odobri
      </Button>
      <Button type='button' size='sm' variant='outline' disabled={pending} onClick={() => moderate('REJECTED')} className='border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive'>
        <X className='size-3.5' />
        Odbij
      </Button>
    </div>
  )
}
