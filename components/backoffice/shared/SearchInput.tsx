'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Пребарај...' }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Дебаунс функција која ќе се изврши 500ms откако корисникот ќе престане да пишува
  const handleSearch = useDebouncedCallback((term: string) => {
    let params: URLSearchParams

    if (term) {
      // Кога корисникот пребарува, бришеме сè и почнуваме од нула со чисти параметри
      params = new URLSearchParams()
      params.set('q', term)
    } else {
      // Кога ќе го избрише пребарувањето, ги земаме постоечките параметри и само го отстрануваме 'q'
      params = new URLSearchParams(searchParams.toString())
      params.delete('q')
      params.delete('page') // исто така ресетираме на прва страница
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
      />

      {/* Спинер кој се прикажува додека Next.js ги влече новите филтрирани податоци */}
      {isPending && (
        <Loader2 className='absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary' />
      )}
    </div>
  )
}
