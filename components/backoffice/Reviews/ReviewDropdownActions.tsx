'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, LoaderCircle, MoreVertical, Trash2, X } from 'lucide-react'

import { ReviewStatus } from '@/lib/generated/prisma'
import {
  moderateReviewAction,
  deleteReviewAction,
} from '@/actions/backoffice/reviews'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ReviewDropdownActionsProps {
  reviewId: string
  currentStatus: ReviewStatus
}

export function ReviewDropdownActions({
  reviewId,
  currentStatus,
}: ReviewDropdownActionsProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const moderate = (status: ReviewStatus) =>
    startTransition(async () => {
      // Испраќаме објект кој го совпаѓа updateReviewModerationSchema
      const result = await moderateReviewAction({ reviewId, status })

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })

  const deleteReview = () =>
    startTransition(async () => {
      if (
        !confirm(
          'Дали сте сигурни дека сакате целосно да ја избришете оваа рецензија?',
        )
      ) {
        return
      }

      // Испраќаме објект кој го совпаѓа deleteReviewSchema
      const result = await deleteReviewAction({ reviewId })

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-muted-foreground'
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle className='h-4 w-4 animate-spin' />
          ) : (
            <MoreVertical className='h-4 w-4' />
          )}
          <span className='sr-only'>Отвори мени</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-40'>
        {currentStatus !== ReviewStatus.APPROVED &&
          currentStatus !== ReviewStatus.PENDING && (
            <DropdownMenuItem
              onClick={() => moderate(ReviewStatus.APPROVED)}
              className='cursor-pointer'
            >
              <Check className='mr-2 h-4 w-4 text-emerald-500' />
              <span>Одобри</span>
            </DropdownMenuItem>
          )}

        {currentStatus !== ReviewStatus.REJECTED &&
          currentStatus !== ReviewStatus.PENDING && (
            <DropdownMenuItem
              onClick={() => moderate(ReviewStatus.REJECTED)}
              className='cursor-pointer'
            >
              <X className='mr-2 h-4 w-4 text-amber-500' />
              <span>Одбиј</span>
            </DropdownMenuItem>
          )}

        {currentStatus !== ReviewStatus.PENDING && <DropdownMenuSeparator />}

        <DropdownMenuItem
          onClick={deleteReview}
          className='cursor-pointer text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          <span>Избриши</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
