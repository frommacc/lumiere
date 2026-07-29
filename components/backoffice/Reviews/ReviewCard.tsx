import { ReviewStatus, Review, User } from '@/lib/generated/prisma'
import { getUserInitials } from '@/lib/utils'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'
import { ReviewActions } from '@/components/backoffice/Reviews/ReviewActions'
import { ReviewDropdownActions } from '@/components/backoffice/Reviews/ReviewDropdownActions' // НОВО

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const reviewStatusStyle: Record<ReviewStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  APPROVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  REJECTED: 'bg-destructive/10 text-destructive border-destructive/20',
}

type ReviewWithUser = Review & {
  user: User
}

interface ReviewCardProps {
  review: ReviewWithUser
}

export function ReviewCard({ review }: ReviewCardProps) {
  const userAvatar = review.user?.image || undefined
  const initials = getUserInitials(review.name || review.user?.name)

  return (
    <Card className='flex flex-col justify-between border-outline-variant/20 bg-surface-container-low/40 shadow-sm transition-all hover:border-outline-variant/40'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 border border-outline-variant/30'>
              <AvatarImage src={userAvatar} alt={review.name} />
              <AvatarFallback className='bg-primary/10 text-primary font-medium text-xs'>
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className='font-semibold text-base leading-none'>
                {review.name}
              </h3>
              <p className='mt-1.5 text-xs text-muted-foreground'>
                {review.user?.email} ·{' '}
                {formatBackofficeDateTime(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Горе десно: Баџ за статус + Три точки (Dropdown) */}
          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className={`text-[10px] font-semibold uppercase tracking-wider ${reviewStatusStyle[review.status]}`}
            >
              {review.status}
            </Badge>

            {/* Ова е новото паѓачко мени */}
            <ReviewDropdownActions
              reviewId={review.id}
              currentStatus={review.status}
            />
          </div>
        </div>

        <div className='mt-3.5 flex items-center gap-1 text-amber-400 text-sm'>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={i < review.rating ? 'opacity-100' : 'opacity-20'}
            >
              ★
            </span>
          ))}
          <span className='ml-1 text-xs text-muted-foreground font-medium'>
            ({review.rating}/5)
          </span>
        </div>
      </CardHeader>

      <CardContent className='py-2 text-sm text-foreground/90 leading-relaxed'>
        <p className='whitespace-pre-line'>{review.text}</p>
      </CardContent>

      {/* Оставаме големи копчиња САМО за PENDING (за побрзо работење на новите) */}
      {review.status === ReviewStatus.PENDING && (
        <CardFooter className='pt-4 border-t border-border/40 mt-auto'>
          <ReviewActions reviewId={review.id} currentStatus={review.status} />
        </CardFooter>
      )}
    </Card>
  )
}
