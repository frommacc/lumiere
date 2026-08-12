'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'

interface LoadMoreOrdersProps {
  currentLimit: number
  hasMore: boolean
  pageSize?: number
}

export function LoadMoreOrders({
  currentLimit,
  hasMore,
  pageSize = 10,
}: LoadMoreOrdersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  if (!hasMore) return null

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams)
    const nextLimit = currentLimit + pageSize
    params.set('limit', nextLimit.toString())

    startTransition(() => {
      // scroll: false allows the user to stay in the same place on the scroll
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className='mt-16 flex flex-col items-center gap-6'>
      <div className='w-24 h-px bg-outline-variant/50' />
      <button
        onClick={handleLoadMore}
        disabled={isPending}
        className='font-label-caps text-label-caps uppercase tracking-[0.4em] text-outline hover:text-primary transition-colors flex items-center gap-4 group disabled:opacity-50 cursor-pointer'
      >
        {isPending ? (
          <>            Loading...
            <Loader2 className='w-5 h-5 animate-spin text-primary' />
          </>
        ) : (
          <>            Load more
            <ChevronDown className='w-5 h-5 group-hover:translate-y-1 transition-transform' />
          </>
        )}
      </button>
    </div>
  )
}
