'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, X, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  /** The name of the parameter in the URL (default: 'date') */
  paramName?: string
  /** Display date format (default: 'yyyy-MM-dd') */
  dateFormat?: string
  /** Text when no date is selected */
  placeholder?: string
  /** Additional Tailwind classes */
  className?: string
  /** Should there be a delete button (X) */
  clearable?: boolean
}

export function DatePicker({
  paramName = 'date',
  dateFormat = 'dd-MM-yyyy',
  placeholder = 'Choose a date',
  className,
  clearable = true,
}: DatePickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [openCalendar, setOpenCalendar] = useState(false)

  // We read the date directly from the URL parameters
  const dateParam = searchParams.get(paramName)
  const currentDate = dateParam ? parseISO(dateParam) : undefined

  const updateUrlParam = (selectedDate: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedDate) {
      params.set(paramName, format(selectedDate, 'yyyy-MM-dd'))
    } else {
      params.delete(paramName)
    }

    // We use startTransition for better performance (UI stays responsive while fetching new data)
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    setOpenCalendar(false)
    updateUrlParam(selectedDate)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation() // Don't open calendar on X click
    updateUrlParam(undefined)
  }

  return (
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={isPending}
          className={cn(
            'w-full justify-start text-left font-normal sm:w-56 bg-surface-container-high border-outline-variant/30 relative pr-8',
            !currentDate && 'text-muted-foreground',
            className,
          )}
        >
          {isPending ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin shrink-0' />
          ) : (
            <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
          )}

          <span className='truncate'>
            {currentDate ? format(currentDate, dateFormat) : placeholder}
          </span>          {/* Clear filter button (X) */}
          {clearable && currentDate && !isPending && (
            <span
              role='button'
              tabIndex={0}
              onClick={handleClear}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'
            >
              <X className='h-3.5 w-3.5' />
              <span className='sr-only'>Clear date</span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={currentDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
