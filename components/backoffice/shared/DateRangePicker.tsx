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
  placeholder = 'Избери опсег',
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

  // 1. Го пресметуваме опсегот од URL
  const urlRange: DateRange | undefined =
    fromParam || toParam
      ? {
          from: fromParam ? parseISO(fromParam) : undefined,
          to: toParam ? parseISO(toParam) : undefined,
        }
      : undefined

  // 2. Локален state за интеракција во самиот календар
  const [range, setRange] = useState<DateRange | undefined>(urlRange)

  // 3. Синхронизација без useEffect (Render-phase update):
  // Ги следиме претходните параметри од URL за да детектираме кога се промениле од надвор
  const [prevParams, setPrevParams] = useState({ fromParam, toParam })

  if (prevParams.fromParam !== fromParam || prevParams.toParam !== toParam) {
    setPrevParams({ fromParam, toParam })
    setRange(urlRange)
  }

  // Помошна функција за ажурирање на URL
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
    // 1. Ако веќе имаме завршен range (од и до) и кликнеме нов ден -> ресетирај и започни нов range од кликнатиот ден
    if (range?.from && range?.to) {
      setRange({ from: selectedDay, to: undefined })
      return
    }

    // 2. Ако НЕМАМЕ уште избрано 'from' (ова е прв клик воопшто или после clear) -> постави го САМО 'from'
    if (!range?.from) {
      setRange({ from: selectedDay, to: undefined })
      return
    }

    // 3. Ако веќе имаме 'from', а немаме 'to' (ова е вториот клик) -> формирај го комплетниот range
    // Забелешка: Се грижиме за редоследот ако корисникот кликнал помал датум од почетниот
    let nextRange: DateRange | undefined

    if (selectedDay < range.from) {
      nextRange = { from: selectedDay, to: range.from }
    } else {
      nextRange = { from: range.from, to: selectedDay }
    }

    setRange(nextRange)

    // Дури СЕГА го затвораме календарот и запишуваме во URL бидејќи ова е вториот клик!
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

    // При рачно затворање на календарот, ажурирај го URL-то со моменталната состојба
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
                <span className='sr-only'>Исчисти филтер</span>
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
