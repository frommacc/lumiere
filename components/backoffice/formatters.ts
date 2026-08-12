import { RESTAURANT_TIMEZONE } from '@/lib/reservations'

export function formatBackofficeDateTime(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: RESTAURANT_TIMEZONE,
  }).format(value)
}

export function formatBackofficeTime(value: Date | string) {
  const dateObj = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: RESTAURANT_TIMEZONE,
  }).format(dateObj)
}

export function formatBackofficeDate(value: Date | string) {
  const dateObj = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    timeZone: RESTAURANT_TIMEZONE,
  }).format(dateObj)
}
