'use client'

import { useTransition } from 'react'
import { Check, LoaderCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { moderateReviewAction } from '@/actions/backoffice/reviews'
import { ReviewStatus } from '@/lib/generated/prisma'

interface ReviewActionsProps {
  reviewId: string
  currentStatus: ReviewStatus
}

export function ReviewActions({ reviewId, currentStatus }: ReviewActionsProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const moderate = (status: ReviewStatus) =>
    startTransition(async () => {
      const result = await moderateReviewAction({ reviewId, status })
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })

  return (
    <div className='flex gap-2 justify-end w-full'>
      {(currentStatus === ReviewStatus.PENDING ||
        currentStatus === ReviewStatus.REJECTED) && (
        <Button
          type='button'
          size='sm'
          disabled={pending}
          onClick={() => moderate(ReviewStatus.APPROVED)}
        >
          {pending ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <Check className='size-3.5' />
          )}
          Одобри
        </Button>
      )}

      {(currentStatus === ReviewStatus.PENDING ||
        currentStatus === ReviewStatus.APPROVED) && (
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={pending}
          onClick={() => moderate(ReviewStatus.REJECTED)}
          className='border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive'
        >
          {pending ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <X className='size-3.5' />
          )}
          Одбиј
        </Button>
      )}
    </div>
  )
}
