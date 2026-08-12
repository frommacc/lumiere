'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Search...' }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // A debounce function that will be executed 500ms after the user stops typing
  const handleSearch = useDebouncedCallback((term: string) => {
    let params: URLSearchParams

    if (term) {
      // When the user searches, we delete everything and start from scratch with clean parameters
      params = new URLSearchParams()
      params.set('q', term)
    } else {
      // When it clears the search, we take the existing parameters and just remove the 'q'
      params = new URLSearchParams(searchParams.toString())
      params.delete('q')
      params.delete('page') // we also reset to the first page
    }

    startTransition(() => {
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
  }, 500)

  return (
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60' />

      <Input
        defaultValue={searchParams.get('q')?.toString()}
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        className='bg-surface-container-high pl-9 pr-9'
      />      {/* A spinner that displays while Next.js pulls the new filtered data */}
      { isPending && (
        <Loader2 className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary' />
      )}
    </div>
  )
}
