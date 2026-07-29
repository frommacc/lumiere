import { RESTAURANT_TIMEZONE } from '@/lib/reservations'

export function formatBackofficeDateTime(value: Date) {
  return new Intl.DateTimeFormat('mk-MK', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: RESTAURANT_TIMEZONE,
  }).format(value)
}

export function formatBackofficeTime(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: RESTAURANT_TIMEZONE,
  }).format(value)
}
