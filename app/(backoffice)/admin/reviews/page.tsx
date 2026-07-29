import { ReviewStatus } from '@/lib/generated/prisma'
import { requireRouteAccess } from '@/lib/authorization'
import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'

import { ReviewTabs } from '@/components/backoffice/Reviews/ReviewTabs'
import { ReviewCard } from '@/components/backoffice/Reviews/ReviewCard'
import { getAdminReviews } from '@/lib/db/backoffice/reviews.services'
import { PaginationControls } from '@/components/backoffice/shared/pagination-controls'

const PAGE_SIZE = 8

interface PageProps {
  searchParams: Promise<{
    status?: ReviewStatus
    page?: string
  }>
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  await requireRouteAccess('/admin/reviews')

  const resolvedSearchParams = await searchParams
  const currentStatus = resolvedSearchParams.status || ReviewStatus.PENDING
  const currentPage = Number(resolvedSearchParams.page) || 1

  const { reviews, totalPages, totalCount, counts } = await getAdminReviews({
    status: currentStatus,
    page: currentPage,
    limit: PAGE_SIZE,
  })

  return (
    <>
      <BackofficeHeader
        eyebrow='Модерација'
        title='Рецензии'
        description='Прегледајте ги и модерирајте ги корисничките рецензии.'
      />

      <div className='px-6 py-8 md:px-10 space-y-6'>
        {/* Табови */}
        <ReviewTabs currentStatus={currentStatus} counts={counts} />

        {/* Мрежа со картички */}
        {reviews.length > 0 ? (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className='rounded-xl border border-dashed p-12 text-center text-muted-foreground'>
            <p className='text-sm'>Нема рецензии за овој статус.</p>
          </div>
        )}

        {/* Вашата реупотреблива пагинација */}
        <div className='rounded-xl border border-outline-variant/20 overflow-hidden'>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </>
  )
}
