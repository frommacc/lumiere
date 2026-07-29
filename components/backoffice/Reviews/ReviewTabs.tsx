import Link from 'next/link'
import { ReviewStatus } from '@/lib/generated/prisma'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ReviewTabsProps {
  currentStatus: ReviewStatus
  counts: {
    PENDING: number
    APPROVED: number
    REJECTED: number
  }
}

export function ReviewTabs({ currentStatus, counts }: ReviewTabsProps) {
  return (
    <Tabs defaultValue={currentStatus} className='w-full'>
      <TabsList className='grid w-full grid-cols-3 max-w-md'>
        <TabsTrigger value={ReviewStatus.PENDING} asChild>
          <Link href={`/admin/reviews?status=${ReviewStatus.PENDING}`}>
            Чекаат ({counts.PENDING})
          </Link>
        </TabsTrigger>
        <TabsTrigger value={ReviewStatus.APPROVED} asChild>
          <Link href={`/admin/reviews?status=${ReviewStatus.APPROVED}`}>
            Одобрени ({counts.APPROVED})
          </Link>
        </TabsTrigger>
        <TabsTrigger value={ReviewStatus.REJECTED} asChild>
          <Link href={`/admin/reviews?status=${ReviewStatus.REJECTED}`}>
            Одбиени ({counts.REJECTED})
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
