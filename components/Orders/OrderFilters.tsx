'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function OrderFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  // Delay function (300ms debounce)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    // We add startTransition for a smooth update without chopping
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className='relative w-full sm:w-80 group'>      {/* Search icon or Loader while changing parameters */}
      {isPending ? (
        <Loader2 className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary animate-spin pointer-events-none z-10' />
      ) : (
        <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors pointer-events-none z-10' />
      )}

      <Input
        type='text'
        placeholder='Search order...'
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className='pl-9 bg-transparent border-b border-outline-variant/50 rounded-none focus-visible:ring-0 focus-visible:border-primary font-body-md text-on-surface placeholder:text-outline border-t-0 border-x-0'
      />
    </div>
  )
}
