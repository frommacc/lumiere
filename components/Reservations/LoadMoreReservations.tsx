'use client'

import { ChevronDown, Loader2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function LoadMoreReservations({
  currentLimit,
  hasMore,
  pageSize = 10,
}: {
  currentLimit: number
  hasMore: boolean
  pageSize?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  if (!hasMore) return null

  const loadMore = () => {
    const params = new URLSearchParams(searchParams)
    params.set('limit', String(currentLimit + pageSize))

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className='mt-16 flex flex-col items-center gap-6'>
      <div className='h-px w-24 bg-outline-variant/50' />
      <button
        type='button'
        onClick={loadMore}
        disabled={isPending}
        className='group flex items-center gap-4 font-label-caps text-label-caps uppercase tracking-[0.4em] text-outline transition-colors hover:text-primary disabled:opacity-50'
      >
        {isPending ? <><span>Се вчитува...</span><Loader2 className='size-5 animate-spin text-primary' /></> : <><span>Вчитај повеќе</span><ChevronDown className='size-5 transition-transform group-hover:translate-y-1' /></>}
      </button>
    </div>
  )
}
