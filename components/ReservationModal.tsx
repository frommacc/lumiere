'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { CalendarIcon, CheckCircle, LoaderCircle, LogIn } from 'lucide-react'
import { toast } from 'sonner'

import {
  createReservationAction,
  getReservationAvailabilityAction,
  getReservationTableTypesAction,
  type CreateReservationResult,
} from '@/actions/reservation'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth-client'
import {
  getReservationDateKey,
  RESERVATION_DURATIONS,
} from '@/lib/reservations'
import {
  reservationFormSchema,
  type ReservationFormValues,
} from '@/lib/validations/reservation'
import { useReservationStore } from '@/store/useReservationStore'

type TableTypeOption = {
  id: string
  slug: string
  name: string
  description: string | null
}

type ReservationSuccess = Extract<CreateReservationResult, { success: true }>

const MAX_ADVANCE_DAYS = 90

function getDateFromKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getMaxReservationDate() {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS)
  return maxDate
}

function formatDurationLabel(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  const hourLabel = hours === 1 ? 'hour' : 'hours'

  return `${hours} ${hourLabel}${minutes ? ` and ${minutes} min.` : ''}`
}

function FormFieldError({ message }: { message?: string }) {
  return message? <p className='mt-1 text-xs text-destructive'>{message}</p> : null
}

export default function ReservationModal() {
  const { isOpen, closeReservation } = useReservationStore()
  const { data: session, isPending: isSessionPending } = useSession()
  const user = session?.user
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [tableTypes, setTableTypes] = useState<TableTypeOption[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [slotMessage, setSlotMessage] = useState<string | null>(null)
  const [reservation, setReservation] = useState<ReservationSuccess['reservation'] | null>(null)
  const [isLoadingTypes, startTypesTransition] = useTransition()
  const [isLoadingSlots, startSlotsTransition] = useTransition()
  const [isSubmitting, startSubmitTransition] = useTransition()

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      date: getReservationDateKey(new Date()),
      time: '',
      guests: 2,
      durationMinutes: 90,
      tableTypeId: '',
      name: '',
      phone: '',
      email: '',
      specialRequests: '',
    },
    mode: 'onTouched',
  })

  const date = useWatch({ control: form.control, name: 'date' })
  const time = useWatch({ control: form.control, name: 'time' })
  const guests = useWatch({ control: form.control, name: 'guests' })
  const durationMinutes = useWatch({ control: form.control, name: 'durationMinutes' })
  const tableTypeId = useWatch({ control: form.control, name: 'tableTypeId' })

  useEffect(() => {
    if (!user) return

    form.reset({
      ...form.getValues(),
      name: user.name ?? '',
      phone: user.phone ?? '',
      email: user.email ?? '',
    })
  }, [form, user])

  useEffect(() => {
    if (!isOpen || !user) return

    let isCurrent = true
    startTypesTransition(async () => {
      const result = await getReservationTableTypesAction()
      if (!isCurrent) return

      if (!result.success) {
        toast.error(result.message)
        return
      }

      setTableTypes(result.tableTypes)
      const selectedType = result.tableTypes.find(
        (type) => type.id === form.getValues('tableTypeId'),
      )
      if (!selectedType) {
        form.setValue('tableTypeId', result.tableTypes[0]?.id ?? '', {
          shouldValidate: true,
        })
      }
    })

    return () => {
      isCurrent = false
    }
  }, [form, isOpen, user])

  useEffect(() => {
    if (!isOpen || !user || !date || !tableTypeId) return

    let isCurrent = true
    startSlotsTransition(async () => {
      const result = await getReservationAvailabilityAction({
        date,
        tableTypeId,
        guests,
        durationMinutes,
      })
      if (!isCurrent) return

      if (!result.success) {
        setAvailableSlots([])
        setSlotMessage(result.message)
        return
      }

      setAvailableSlots(result.slots)
      const selectedTime = form.getValues('time')
      if (!result.slots.includes(selectedTime)) {
        form.setValue('time', result.slots[0] ?? '', {
          shouldValidate: true,
        })
      }
      if (!result.slots.length) {
        setSlotMessage('There are no available appointments for the selected date and setting.')
      }
    })

    return () => {
      isCurrent = false
    }
  }, [date, durationMinutes, form, guests, isOpen, tableTypeId, user])

  const resetForm = () => {
    form.reset({
      date: getReservationDateKey(new Date()),
      time: '',
      guests: 2,
      durationMinutes: 90,
      tableTypeId: '',
      name: session?.user?.name ?? '',
      phone: session?.user?.phone ?? '',
      email: session?.user?.email ?? '',
      specialRequests: '',
    })
    setTableTypes([])
    setAvailableSlots([])
    setSlotMessage(null)
    setReservation(null)
    setIsCalendarOpen(false)
  }

  const handleClose = () => {
    resetForm()
    closeReservation()
  }

  const onSubmit = (values: ReservationFormValues) => {
    if (!availableSlots.includes(values.time)) {
      form.setError('time', { message: 'Choose a free term.' })
      return
    }

    startSubmitTransition(async () => {
      const result = await createReservationAction(values)
      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          form.setError(field as keyof ReservationFormValues, {
            message: messages?.[0],
          })
        })
        toast.error(result.message)
        return
      }

      setReservation(result.reservation)
      toast.success(result.message)
    })
  }

  const selectedDate = date ? getDateFromKey(date) : undefined

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='w-full max-w-4xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container p-0 text-on-surface shadow-2xl gap-0 max-h-[90vh] flex flex-col md:min-w-2xl'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Table reservation</DialogTitle>
          <DialogDescription>            Choose a date, time and setting for your reservation.
          </DialogDescription>
        </DialogHeader>

        <div className='shrink-0 border-b border-outline-variant/20 px-6 py-4'>
          <h3 className='font-display text-lg font-bold uppercase tracking-wide text-primary md:text-xl'>            Table reservation
          </h3>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          {isSessionPending ? (
            <div className='space-y-5'>
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-36 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : !session?.user ? (
            <div className='mx-auto max-w-md py-12 text-center'>
              <LogIn className='mx-auto mb-4 h-12 w-12 text-primary' />
              <h4 className='font-display text-2xl font-bold'>Log in to make a reservation</h4>
              <p className='mt-2 text-sm text-on-surface-variant'>                Bookings are linked to your profile so you can easily track them.
              </p>
              <Button asChild className='mt-6'>
                <Link href='/login?redirect_url=/'>Log in</Link>
              </Button>
            </div>
          ) : reservation ? (
            <ReservationTicket reservation={reservation} onClose={handleClose} />
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' noValidate>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <Label className='mb-2 block'>Date</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        variant='outline'
                        className='h-auto w-full justify-start rounded border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-left font-normal text-on-surface hover:bg-surface-container-high/80'
                      >
                        <CalendarIcon className='mr-2 h-4 w-4 text-primary' />                        {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: enUS }) : 'Select a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto border border-outline-variant/30 bg-surface-container-high p-0 text-on-surface' align='start'>
                      <Calendar
                        mode='single'
                        selected={selectedDate}
                        onSelect={(selected) => {
                          if (!selected) return
                          form.setValue('date', format(selected, 'yyyy-MM-dd'), {
                            shouldValidate: true,
                          })
                          setIsCalendarOpen(false)
                        }}
                        disabled={(calendarDate) =>
                          calendarDate < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          calendarDate > getMaxReservationDate()
                        }
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormFieldError message={form.formState.errors.date?.message} />
                </div>

                <div>
                  <Label htmlFor='reservation-guests' className='mb-2'>Number of guests</Label>
                  <Select
                    value={String(guests)}
                    onValueChange={(value) =>
                      form.setValue('guests', Number(value), { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id='reservation-guests' className='h-auto w-full rounded border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm text-on-surface'>
                      <SelectValue placeholder='Choose number of guests' />
                    </SelectTrigger>
                    <SelectContent className='border border-outline-variant/30 bg-surface-container-high text-on-surface'>
                      {Array.from({ length: 14 }, (_, index) => index + 1).map((number) => (
                        <SelectItem key={number} value={String(number)}>                          {number} {number === 1 ? 'face' : 'faces'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='reservation-duration' className='mb-2'>Planned seating</Label>
                  <Select
                    value={String(durationMinutes)}
                    onValueChange={(value) =>
                      form.setValue('durationMinutes', Number(value), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger id='reservation-duration' className='h-auto w-full rounded border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm text-on-surface'>
                      <SelectValue placeholder='Choose a time' />
                    </SelectTrigger>
                    <SelectContent className='border border-outline-variant/30 bg-surface-container-high text-on-surface'>
                      {RESERVATION_DURATIONS.map((duration) => (
                        <SelectItem key={duration} value={String(duration)}>
                          {formatDurationLabel(duration)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormFieldError message={form.formState.errors.durationMinutes?.message} />
                </div>
              </div>

              <div>
                <Label className='mb-2 block'>Time</Label>
                {isLoadingSlots ? (
                  <div className='grid grid-cols-3 gap-2 sm:grid-cols-5'>
                    {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className='h-9' />)}
                  </div>
                ) : availableSlots.length ? (
                  <div className='grid grid-cols-3 gap-2 sm:grid-cols-5'>
                    {availableSlots.map((slot) => (
                      <button
                        type='button'
                        key={slot}
                        onClick={() => form.setValue('time', slot, { shouldValidate: true })}
                        className={`rounded-sm border py-2 text-xs font-medium transition-all ${
                          time === slot
                            ? 'border-primary bg-primary font-semibold text-primary-foreground'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className='rounded-md border border-outline-variant/30 bg-surface-container-high p-3 text-sm text-on-surface-variant'>                    { slotMessage ?? 'Select a date and location to see available appointments.'}
                  </p>
                )}
                <FormFieldError message={form.formState.errors.time?.message} />
              </div>

              <div>
                <Label className='mb-2 block'>Ambience and accommodation</Label>
                {isLoadingTypes ? (
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <Skeleton className='h-20' />
                    <Skeleton className='h-20' />
                  </div>
                ) : tableTypes.length ? (
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    {tableTypes.map((type) => (
                        <button
                          type='button'
                          key={type.id}
                          onClick={() => form.setValue('tableTypeId', type.id, { shouldValidate: true })}
                          className={`rounded-md border p-3 text-left transition-all ${
                            tableTypeId === type.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-outline-variant/20 hover:border-outline-variant/50'
                          }`}
                        >
                          <span className='block text-xs font-bold uppercase tracking-wider text-on-surface'>
                            {type.name}
                          </span>
                          {type.description && <span className='mt-1 block text-[11px] text-muted-foreground'>{type.description}</span>}
                        </button>
                    ))}
                  </div>
                ) : (
                  <p className='rounded-md border border-outline-variant/30 bg-surface-container-high p-3 text-sm text-on-surface-variant'>                    There are no table types configured.
                  </p>
                )}
                <FormFieldError message={form.formState.errors.tableTypeId?.message} />
              </div>

              <div className='space-y-4 border-t border-outline-variant/20 pt-4'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-primary'>Contact information</p>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Input id='reservation-name' autoComplete='name' placeholder='Name and surname' aria-invalid={!!form.formState.errors.name} {...form.register('name')} />
                    <FormFieldError message={form.formState.errors.name?.message} />
                  </div>
                  <div>
                    <Input id='reservation-phone' type='tel' autoComplete='tel' placeholder='Telephone number' aria-invalid={!!form.formState.errors.phone} {...form.register('phone')} />
                    <FormFieldError message={form.formState.errors.phone?.message} />
                  </div>
                </div>
                <div>
                  <Input id='reservation-email' type='email' autoComplete='email' placeholder='Confirmation email' aria-invalid={!!form.formState.errors.email} {...form.register('email')} />
                  <FormFieldError message={form.formState.errors.email?.message} />
                </div>
              </div>

              <div>
                <Label htmlFor='reservation-requests' className='mb-2'>Special requirements (optional)</Label>
                <textarea
                  id='reservation-requests'
                  rows={3}
                  placeholder='Allergies, birthday or other important details.'
                  className='w-full rounded border border-outline-variant/30 bg-surface-container-high p-3 text-sm text-on-surface placeholder:text-muted-foreground focus:border-primary focus:outline-none'
                  {...form.register('specialRequests')}
                />
                <FormFieldError message={form.formState.errors.specialRequests?.message} />
              </div>

              <Button type='submit' disabled={isSubmitting || isLoadingSlots || !availableSlots.length || !tableTypeId} className='h-auto w-full py-4 text-xs uppercase tracking-widest'>
                {isSubmitting && <LoaderCircle className='animate-spin' />}
                {isSubmitting ? 'Confirming...' : 'Confirm booking'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReservationTicket({
  reservation,
  onClose,
}: {
  reservation: ReservationSuccess['reservation']
  onClose: () => void
}) {
  const date = getDateFromKey(reservation.date)

  return (
    <div className='space-y-6 px-4 py-8 text-center'>
      <CheckCircle size={60} className='mx-auto text-primary' />
      <div>
        <h4 className='font-display text-2xl font-bold'>The request has been sent!</h4>
        <p className='mx-auto mt-2 max-w-md text-xs text-on-surface-variant'>          Thank you {reservation.name}. You will receive an email at {' '}
          <span className='text-primary'>{reservation.email}</span> as soon as the restaurant
          confirm the reservation. You can also follow the status in yours
          reservations.
        </p>
      </div>

      <div className='relative mx-auto max-w-md overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high p-6 text-left'>
        <p className='mb-4 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-primary'>Official gastronomic ticket</p>
        <div className='grid grid-cols-2 gap-x-2 gap-y-4 border-b border-outline-variant/20 pb-4 text-xs'>
          <TicketDetail label='Date' value={format(date, 'dd MMMM yyyy', { locale: enUS })} />
          <TicketDetail label='Time' value={`${reservation.time} hour`} />
          <TicketDetail label='Planned seating' value={`${reservation.durationMinutes} minutes`} />
          <TicketDetail label='Table for' value={`${reservation.guests} ${reservation.guests === 1 ? 'guest' : 'guests'}`} />
          <TicketDetail label='Location' value={reservation.tableTypeName} />
        </div>
        <div className='flex items-center justify-between pt-4 text-xs'>
          <TicketDetail label='Reference code' value={reservation.reference} mono />
          <TicketDetail label='Restaurant' value='LUMIÈRE' align='right' />
        </div>
      </div>

      <Button variant='outline' onClick={onClose}>Close</Button>
    </div>
  )
}

function TicketDetail({
  label,
  value,
  mono = false,
  align = 'left',
}: {
  label: string
  value: string
  mono?: boolean
  align?: 'left' | 'right'
}) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <span className='block text-[9px] font-medium uppercase text-on-surface-variant'>{label}</span>
      <span className={`font-bold text-on-surface ${mono ? 'font-mono tracking-wider text-primary' : ''}`}>{value}</span>
    </div>
  )
}
