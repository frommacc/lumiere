'use client'
import React, { useState } from 'react'
import { TableType } from '@/types/default'
import { CheckCircle } from 'lucide-react'
import { useReservationStore } from '@/store/useReservationStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { mk } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function ReservationModal() {
  const { isOpen, closeReservation } = useReservationStore()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('20:00')
  const [guests, setGuests] = useState(2)
  const [tableType, setTableType] = useState<TableType>('standard')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reservationCode, setReservationCode] = useState('')

  const timeSlots = [
    '12:30',
    '14:00',
    '18:00',
    '19:30',
    '20:00',
    '21:30',
    '22:30',
  ]

  const tableTypes: { value: TableType; label: string; desc: string }[] = [
    {
      value: 'standard',
      label: 'Стандардна Сала',
      desc: 'Удобна маса во средишниот главен дел.',
    },
    {
      value: 'window',
      label: 'До Прозорец',
      desc: 'Маса со спектакуларен поглед на центарот на Скопје.',
    },
    {
      value: 'vip_lounge',
      label: 'ВИП Салон',
      desc: 'Приватен и дискретен простор со личен келнер.',
    },
    {
      value: 'outdoor',
      label: 'Летна Тераса',
      desc: 'Маса на отворено под ѕвездите.',
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = 'LUM-' + Math.floor(1000 + Math.random() * 9000)
    setReservationCode(code)
    setIsSubmitted(true)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setIsCalendarOpen(false)
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setDate(undefined)
    setTime('20:00')
    setGuests(2)
    setTableType('standard')
    setName('')
    setPhone('')
    setEmail('')
    setSpecialRequests('')
    closeReservation()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleResetAndClose()}
    >
      <DialogContent className='w-full md:min-w-2xl max-w-4xl bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl p-0 gap-0 max-h-[90vh] flex flex-col text-on-surface'>
        {/* Hidden DialogHeader for Accessibility (Radix/shadcn requirement) */}
        <DialogHeader className='sr-only'>
          <DialogTitle>Резервација на Маса</DialogTitle>
          <DialogDescription>
            Пополнете ги деталите за да резервирате маса во нашиот ресторан.
          </DialogDescription>
        </DialogHeader>

        {/* Custom Visible Header */}
        <div className='flex justify-between items-center px-6 py-4 border-b border-outline-variant/20 shrink-0'>
          <h3 className='font-display text-lg md:text-xl font-bold text-primary uppercase tracking-wide'>
            Резервација на Маса
          </h3>
        </div>

        {/* Scrollable Form Body */}
        <div className='p-6 overflow-y-auto flex-1'>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Row 1: Date & Time */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2'>
                    Датум
                  </label>
                  <div className='relative'>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={`w-full justify-start text-left font-normal bg-surface-container-high border border-outline-variant/30 text-on-surface rounded px-4 py-3 h-auto hover:bg-surface-container-high/80 focus:ring-1 focus:ring-primary focus:border-primary ${
                            !date ? 'text-on-surface-variant/40' : ''
                          }`}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4 text-primary' />
                          {date ? (
                            format(date, 'dd MMMM yyyy', { locale: mk })
                          ) : (
                            <span>Изберете датум</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0 bg-surface-container-high border border-outline-variant/30 text-on-surface'
                        align='start'
                      >
                        <Calendar
                          mode='single'
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <label className='block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2'>
                    Број на Гости
                  </label>
                  <Select
                    value={String(guests)}
                    onValueChange={(val) => setGuests(Number(val))}
                  >
                    <SelectTrigger className='w-full bg-surface-container-high border border-outline-variant/30 text-on-surface rounded px-4 py-3 text-sm h-auto focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none'>
                      <SelectValue placeholder='Изберете број на гости' />
                    </SelectTrigger>
                    <SelectContent className='bg-surface-container-high border border-outline-variant/30 text-on-surface z-50'>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                        (num) => (
                          <SelectItem
                            key={num}
                            value={String(num)}
                            className='focus:bg-primary/20 focus:text-on-surface cursor-pointer py-2.5 text-sm'
                          >
                            {num} {num === 1 ? 'Лице' : 'Лица'}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Time slots */}
              <div>
                <label className='block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2'>
                  Време
                </label>
                <div className='grid grid-cols-4 sm:grid-cols-7 gap-2'>
                  {timeSlots.map((slot) => (
                    <button
                      type='button'
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 text-xs font-sans font-medium transition-all rounded-sm border ${
                        time === slot
                          ? 'bg-primary text-primary-foreground border-primary font-semibold'
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Table Types */}
              <div>
                <label className='block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2'>
                  Амбиент &amp; Сместување
                </label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {tableTypes.map((type) => (
                    <button
                      type='button'
                      key={type.value}
                      onClick={() => setTableType(type.value)}
                      className={`p-3 text-left rounded-md transition-all border ${
                        tableType === type.value
                          ? 'bg-primary/5 border-primary shadow-sm'
                          : 'border-outline-variant/20 hover:border-outline-variant/50'
                      }`}
                    >
                      <span className='block text-xs font-bold font-sans text-on-surface uppercase tracking-wider'>
                        {type.label}
                      </span>
                      <span className='block text-[11px] text-muted-foreground mt-1'>
                        {type.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Contact details */}
              <div className='space-y-4 pt-4 border-t border-outline-variant/20'>
                <p className='text-[10px] font-sans font-bold uppercase tracking-widest text-primary'>
                  Контакт Информации
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <input
                      type='text'
                      placeholder='Име и Презиме'
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                    />
                  </div>
                  <div>
                    <input
                      type='tel'
                      placeholder='Телефонски број'
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                    />
                  </div>
                </div>

                <div>
                  <input
                    type='email'
                    placeholder='Е-пошта за потврда'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                  />
                </div>
              </div>

              {/* Row 5: Special requests */}
              <div>
                <label className='block text-[10px] font-sans font-bold uppercase tracking-widest text-on-surface-variant mb-2'>
                  Посебни Барања (опционално)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder='Означете ако имате некакви алергии, славите роденден, или сакате одредено вино.'
                  className='w-full bg-surface-container-high border border-outline-variant/30 text-on-surface rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foregroud'
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full bg-primary hover:bg-primary-container text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold py-4 active:scale-95 transition-all duration-300 rounded'
              >
                ПОТВРДИ РЕЗЕРВАЦИЈА
              </button>
            </form>
          ) : (
            /* Confirmation Ticket UI */
            <div className='text-center py-8 px-4 space-y-6'>
              <div className='flex justify-center'>
                <CheckCircle
                  size={60}
                  className='text-primary animate-bounce'
                />
              </div>

              <div>
                <h4 className='font-display text-2xl font-bold text-on-surface'>
                  Резервацијата е потврдена!
                </h4>
                <p className='font-sans text-xs text-on-surface-variant mt-2 max-w-md mx-auto'>
                  Ви благодариме {name}. Нашата екипа со нетрпение ве очекува.
                  Потврда со детали е испратена на{' '}
                  <span className='text-primary'>{email}</span>.
                </p>
              </div>

              {/* Ticket details */}
              <div className='max-w-md mx-auto border border-outline-variant/30 rounded-xl p-6 bg-surface-container-high relative overflow-hidden text-left'>
                {/* Simulated punch holes */}
                <div className='absolute top-1/2 -left-3 w-6 h-6 bg-surface-container-low rounded-full border border-outline-variant/30' />
                <div className='absolute top-1/2 -right-3 w-6 h-6 bg-surface-container-low rounded-full border border-outline-variant/30' />

                <p className='text-[9px] font-sans font-bold tracking-[0.2em] text-primary uppercase text-center mb-4'>
                  ОФИЦИЈАЛЕН ГАСТРОНОМСКИ БИЛЕТ
                </p>

                <div className='grid grid-cols-2 gap-y-4 gap-x-2 border-b border-outline-variant/20 pb-4 text-xs font-sans'>
                  <div>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Датум:
                    </span>
                    <span className='font-bold text-on-surface'>
                      {date
                        ? format(date, 'dd MMMM yyyy', { locale: mk })
                        : '/'}
                    </span>
                  </div>
                  <div>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Време:
                    </span>
                    <span className='font-bold text-on-surface'>
                      {time} часот
                    </span>
                  </div>
                  <div>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Маса за:
                    </span>
                    <span className='font-bold text-on-surface'>
                      {guests} {guests === 1 ? 'лице' : 'лица'}
                    </span>
                  </div>
                  <div>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Локација:
                    </span>
                    <span className='font-bold text-on-surface'>
                      {tableTypes.find((t) => t.value === tableType)?.label}
                    </span>
                  </div>
                </div>

                <div className='pt-4 flex justify-between items-center text-xs font-sans'>
                  <div>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Референтен Код:
                    </span>
                    <span className='font-mono font-bold text-primary text-base tracking-wider'>
                      {reservationCode}
                    </span>
                  </div>
                  <div className='text-right'>
                    <span className='block text-[9px] text-on-surface-variant uppercase font-medium'>
                      Ресторан:
                    </span>
                    <span className='font-bold text-on-surface uppercase tracking-widest text-[10px]'>
                      LUMIÈRE
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className='bg-transparent border border-outline text-on-surface hover:text-primary hover:border-primary px-8 py-3 text-xs uppercase tracking-wider font-sans font-semibold rounded-sm transition-all'
              >
                ЗАТВОРИ
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
