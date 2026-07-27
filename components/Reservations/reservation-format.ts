const MONTHS_MK = [
  'јануари',
  'февруари',
  'март',
  'април',
  'мај',
  'јуни',
  'јули',
  'август',
  'септември',
  'октомври',
  'ноември',
  'декември',
] as const

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Skopje',
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<'day' | 'month' | 'year', string>
}

function getTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Europe/Skopje',
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<'hour' | 'minute', string>
}

export function formatReservationDate(date: Date) {
  const { day, month, year } = getDateParts(date)
  return `${Number(day)} ${MONTHS_MK[Number(month) - 1]} ${year} г.`
}

export function formatReservationTime(date: Date) {
  const { hour, minute } = getTimeParts(date)
  return `${hour}:${minute}`
}

export function formatReservationDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  const hourLabel = hours === 1 ? 'час' : 'часа'

  return `${hours} ${hourLabel}${minutes ? ` и ${minutes} мин.` : ''}`
}
