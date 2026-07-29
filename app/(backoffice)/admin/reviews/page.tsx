import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { ReviewActions } from '@/components/backoffice/ReviewActions'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminReviews } from '@/lib/db/admin.services'
import { ReviewStatus } from '@/lib/generated/prisma'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

const reviewStatusStyle: Record<ReviewStatus, string> = { PENDING: 'bg-primary/10 text-primary', APPROVED: 'bg-emerald-500/10 text-emerald-400', REJECTED: 'bg-destructive/10 text-destructive' }

export default async function AdminReviewsPage() {
  await requireRouteAccess('/admin/reviews')
  const reviews = await getAdminReviews()
  return <><BackofficeHeader eyebrow='Модерација' title='Рецензии' description='Одобрете само рецензии што одговараат на стандардот на ресторанот.' />
    <div className='grid gap-4 px-6 py-8 md:px-10 xl:grid-cols-2'>{reviews.map((review) => <article key={review.id} className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-6'><div className='flex flex-wrap items-start justify-between gap-4'><div><p className='font-medium'>{review.name}</p><p className='mt-1 text-xs text-on-surface-variant'>{review.user.email} · {formatBackofficeDateTime(review.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${reviewStatusStyle[review.status]}`}>{review.status}</span></div><div className='mt-5 flex gap-1 text-primary'>{Array.from({ length: review.rating }, (_, index) => <span key={index}>★</span>)}</div><p className='mt-3 leading-relaxed text-on-surface-variant'>{review.text}</p>{review.status === ReviewStatus.PENDING ? <div className='mt-6 border-t border-outline-variant/15 pt-4'><ReviewActions reviewId={review.id} /></div> : null}</article>)}{!reviews.length ? <p className='py-16 text-center text-sm text-on-surface-variant xl:col-span-2'>Nema reviews za moderacija.</p> : null}</div>
  </>
}
