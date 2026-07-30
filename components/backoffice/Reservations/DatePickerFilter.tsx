'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePickerFilter({ initialDate }: { initialDate: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<Date | undefined>(
    initialDate ? parseISO(initialDate) : undefined,
  )
  const [openCalendar, setOpenCalendar] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpenCalendar(false)

    const params = new URLSearchParams(searchParams.toString())
    if (selectedDate) {
      params.set('date', format(selectedDate, 'yyyy-MM-dd'))
    } else {
      params.delete('date')
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal sm:w-56 bg-surface-container-high border-outline-variant/30',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'yyyy-MM-dd') : <span>Избери датум</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar mode='single' selected={date} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  )
}
