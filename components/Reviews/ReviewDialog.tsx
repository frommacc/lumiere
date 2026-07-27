'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { LoaderCircle, Star } from 'lucide-react'
import { toast } from 'sonner'

import {
  createReviewAction,
  getReviewEligibilityAction,
  type ReviewEligibilityResult,
} from '@/actions/reviews'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useSession } from '@/lib/auth-client'
import { createReviewSchema, type CreateReviewValues } from '@/lib/validations/review'
import { useReviewStore } from '@/store/useReviewStore'

export function ReviewDialog() {
  const { isOpen, close } = useReviewStore()
  const { data: session, isPending: isSessionPending } = useSession()
  const [eligibility, setEligibility] = useState<ReviewEligibilityResult | null>(null)
  const [isCheckingEligibility, startEligibilityTransition] = useTransition()
  const [isSubmitting, startSubmitTransition] = useTransition()
  const form = useForm<CreateReviewValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { rating: 5, text: '' },
    mode: 'onTouched',
  })
  const rating = useWatch({ control: form.control, name: 'rating' })
  const reviewText = useWatch({ control: form.control, name: 'text' })

  useEffect(() => {
    if (!isOpen || !session?.user) return

    let isCurrent = true
    startEligibilityTransition(async () => {
      const result = await getReviewEligibilityAction()
      if (isCurrent) setEligibility(result)
    })

    return () => {
      isCurrent = false
    }
  }, [isOpen, session?.user])

  const handleClose = () => {
    form.reset({ rating: 5, text: '' })
    setEligibility(null)
    close()
  }

  const onSubmit = (values: CreateReviewValues) => {
    startSubmitTransition(async () => {
      const result = await createReviewAction(values)
      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          form.setError(field as keyof CreateReviewValues, {
            message: messages?.[0],
          })
        })
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      handleClose()
    })
  }

  const canReview = eligibility?.success && eligibility.allowed
  const eligibilityMessage = eligibility?.success
    ? eligibility.message
    : eligibility?.message

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='border-outline-variant/30 bg-surface-container text-on-surface sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle className='font-display text-3xl'>Споделете искуство</DialogTitle>
          <DialogDescription className='text-on-surface-variant'>
            Вашиот review прво оди на кратка проверка, па потоа може да биде објавен.
          </DialogDescription>
        </DialogHeader>

        {isSessionPending || isCheckingEligibility ? (
          <div className='space-y-4 py-6'>
            <div className='h-5 w-48 animate-pulse rounded bg-muted' />
            <div className='h-24 animate-pulse rounded bg-muted' />
          </div>
        ) : !session?.user ? (
          <div className='space-y-4 py-6 text-center'>
            <p className='text-sm text-on-surface-variant'>Најавете се за да оставите review.</p>
            <Button asChild><Link href='/login?redirect_url=/'>Најави се</Link></Button>
          </div>
        ) : !canReview ? (
          <div className='rounded-lg border border-outline-variant/20 bg-surface-container-high p-4 text-sm text-on-surface-variant'>
            {eligibilityMessage ?? 'Не успеавме да ја провериме вашата можност за review.'}
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' noValidate>
            <div className='space-y-3'>
              <Label>Оцена</Label>
              <div className='flex gap-2' aria-label='Оцена од 1 до 5'>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => form.setValue('rating', value, { shouldValidate: true })}
                    className='rounded p-1 text-primary transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    aria-label={`${value} ѕвезди`}
                  >
                    <Star className='size-7' fill={value <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              {form.formState.errors.rating?.message && <p className='text-xs text-destructive'>{form.formState.errors.rating.message}</p>}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='review-text'>Вашето искуство</Label>
              <textarea
                id='review-text'
                rows={5}
                maxLength={1000}
                placeholder='Кажете ни што ви се допадна и како помина вашето искуство.'
                className='w-full rounded-md border border-outline-variant/30 bg-surface-container-high p-3 text-sm text-on-surface placeholder:text-muted-foreground focus:border-primary focus:outline-none'
                {...form.register('text')}
              />
              <div className='flex justify-between text-xs text-on-surface-variant'>
                <span>{form.formState.errors.text?.message}</span>
                <span>{reviewText.length}/1000</span>
              </div>
            </div>

            <div className='flex justify-end gap-3 border-t border-outline-variant/20 pt-5'>
              <Button type='button' variant='outline' onClick={handleClose}>Откажи</Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className='animate-spin' />}
                Испрати review
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
