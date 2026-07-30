export const RESTAURANT_TIMEZONE = 'Europe/Skopje'
export const RESERVATION_SLOT_INTERVAL_MINUTES = 30
export const RESERVATION_DURATIONS = [60, 90, 120, 150, 180] as const

export type ReservationDuration = (typeof RESERVATION_DURATIONS)[number]

export type WorkingTimeRange = {
  start: string
  end: string
}

export type ReservationSlot = {
  time: string
  startTime: Date
  endTime: Date
}

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^(\d{2}):(\d{2})$/

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<string, number>

  return (
    Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    ) - date.getTime()
  )
}

export function getReservationDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: RESTAURANT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>

  return `${values.year}-${values.month}-${values.day}`
}

export function isValidReservationDateKey(date: string) {
  if (!dateKeyPattern.test(date)) return false

  const [year, month, day] = date.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

export function isValidReservationTime(time: string) {
  if (!timePattern.test(time)) return false

  const [, hour, minute] = time.match(timePattern)!.map(Number)
  return hour < 24 && minute < 60
}

export function isValidReservationDuration(durationMinutes: number) {
  return RESERVATION_DURATIONS.includes(durationMinutes as ReservationDuration)
}

export function zonedDateTimeToUtc(date: string, time = '00:00') {
  if (!isValidReservationDateKey(date) || !isValidReservationTime(time)) {
    throw new Error('Invalid reservation date or time.')
  }

  const [year, month, day] = date.split('-').map(Number)
  const [, hour, minute] = time.match(timePattern)!.map(Number)
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute))
  const offset = getTimeZoneOffset(utcGuess, RESTAURANT_TIMEZONE)

  return new Date(utcGuess.getTime() - offset)
}

export function getDayOfWeek(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function parseWorkingTimeRanges(value: unknown): WorkingTimeRange[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== 'object' ||
      !('start' in entry) ||
      !('end' in entry) ||
      typeof entry.start !== 'string' ||
      typeof entry.end !== 'string' ||
      !isValidReservationTime(entry.start) ||
      !isValidReservationTime(entry.end) ||
      entry.start >= entry.end
    ) {
      return []
    }

    return [{ start: entry.start, end: entry.end }]
  })
}

export function generateReservationSlots(
  date: string,
  ranges: WorkingTimeRange[],
  durationMinutes: number,
): ReservationSlot[] {
  return ranges.flatMap((range) => {
    const firstStart = zonedDateTimeToUtc(date, range.start)
    const lastEnd = zonedDateTimeToUtc(date, range.end)
    const slots: ReservationSlot[] = []

    for (
      let startTime = firstStart;
      startTime.getTime() + durationMinutes * 60_000 <= lastEnd.getTime();
      startTime = new Date(
        startTime.getTime() + RESERVATION_SLOT_INTERVAL_MINUTES * 60_000,
      )
    ) {
      slots.push({
        time: formatReservationTime(startTime),
        startTime,
        endTime: new Date(startTime.getTime() + durationMinutes * 60_000),
      })
    }

    return slots
  })
}

function formatReservationTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: RESTAURANT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>

  return `${values.hour}:${values.minute}`
}

export function isReservationSlotInPast(
  date: string,
  time: string,
  now = new Date(),
) {
  return zonedDateTimeToUtc(date, time).getTime() <= now.getTime()
}

export function isReservationDateBookable(date: string, now = new Date()) {
  const today = getReservationDateKey(now)
  if (date < today) return false

  const latestBookableDate = new Date(now)
  latestBookableDate.setDate(latestBookableDate.getDate() + 90)

  return date <= getReservationDateKey(latestBookableDate)
}

export function getReservationReference(id: string) {
  return `LUM-${id.slice(-8).toUpperCase()}`
}

export function getDayRange(dateKey = getReservationDateKey(new Date())) {
  return {
    dateKey,
    start: zonedDateTimeToUtc(dateKey, '00:00'),
    end: zonedDateTimeToUtc(
      getReservationDateKey(
        new Date(zonedDateTimeToUtc(dateKey, '00:00').getTime() + 86_400_000),
      ),
      '00:00',
    ),
  }
}
