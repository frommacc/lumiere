'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, X, Loader2 } from 'lucide-react'
import { DateRange, Matcher } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  fromParamName?: string
  toParamName?: string
  placeholder?: string
  className?: string
  dateFormat?: string
  disabled?: Matcher | Matcher[]
}

export function DateRangePicker({
  fromParamName = 'from',
  toParamName = 'to',
  placeholder = 'Select a range',
  className,
  dateFormat = 'yyyy-MM-dd',
  disabled,
}: DateRangePickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const fromParam = searchParams.get(fromParamName)
  const toParam = searchParams.get(toParamName)

  // 1. We calculate the range from the URL
  const urlRange: DateRange | undefined =
    fromParam || toParam
      ? {
          from: fromParam ? parseISO(fromParam) : undefined,
          to: toParam ? parseISO(toParam) : undefined,
        }
      : undefined

  // 2. Local state for interaction in the calendar itself
  const [range, setRange] = useState<DateRange | undefined>(urlRange)

  // 3. Synchronization without useEffect (Render-phase update):
  // We track the previous parameters from the URL to detect when they have changed externally
  const [prevParams, setPrevParams] = useState({ fromParam, toParam })

  if (prevParams.fromParam !== fromParam || prevParams.toParam !== toParam) {
    setPrevParams({ fromParam, toParam })
    setRange(urlRange)
  }

  // URL update helper function
  const applyRangeToUrl = (newRange: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('page')

    if (newRange?.from) {
      params.set(fromParamName, format(newRange.from, 'yyyy-MM-dd'))
    } else {
      params.delete(fromParamName)
    }

    if (newRange?.to) {
      params.set(toParamName, format(newRange.to, 'yyyy-MM-dd'))
    } else {
      params.delete(toParamName)
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleSelect = (selected: DateRange | undefined, selectedDay: Date) => {
    // 1. If we already have a completed range (from and to) and we click a new day -> reset and start a new range from the clicked day
    if (range?.from && range?.to) {
      setRange({ from: selectedDay, to: undefined })
      return
    }

    // 2. If we DON'T have 'from' selected yet (this is the first click at all or after clear) -> set ONLY 'from'
    if (!range?.from) {
      setRange({ from: selectedDay, to: undefined })
      return
    }

    // 3. If we already have 'from' and we don't have 'to' (this is the second click) -> form the complete range
    // Note: We care about the order if the user clicked a smaller date than the starting date
    let nextRange: DateRange | undefined

    if (selectedDay < range.from) {
      nextRange = { from: selectedDay, to: range.from }
    } else {
      nextRange = { from: range.from, to: selectedDay }
    }

    setRange(nextRange)

    // We're only NOW closing the calendar and writing in the URL because this is the second click!
    applyRangeToUrl(nextRange)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRange(undefined)
    applyRangeToUrl(undefined)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    // When manually closing the calendar, update the URL with the current state
    if (!isOpen) {
      if (range?.from !== urlRange?.from || range?.to !== urlRange?.to) {
        applyRangeToUrl(range)
      }
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            disabled={isPending}
            className={cn(
              'w-full justify-start text-left font-normal sm:w-70 relative pr-8 bg-surface-container-high border-outline-variant/30',
              !range?.from && 'text-muted-foreground',
            )}
          >
            {isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin shrink-0' />
            ) : (
              <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
            )}

            <span className='truncate'>
              {range?.from ? (
                range.to ? (
                  <>
                    {format(range.from, dateFormat)} -{' '}
                    {format(range.to, dateFormat)}
                  </>
                ) : (
                  format(range.from, dateFormat)
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </span>

            {range?.from && !isPending && (
              <span
                role='button'
                tabIndex={0}
                onClick={handleClear}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='h-3.5 w-3.5' />
                <span className='sr-only'>Clear filter</span>
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            disabled={disabled}
            // showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
