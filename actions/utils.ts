import { updateTag } from 'next/cache'

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string }

export const forbidden = (): ActionResult => ({
  success: false,
  message: 'Немате дозвола за оваа акција.',
})

export const unauthorized = (): ActionResult => ({
  success: false,
  message: 'Мора да бидете најавени за оваа акција.',
})

export const serverError = (
  message = 'Настана грешка, обидете се повторно.',
): ActionResult => ({
  success: false,
  message,
})

export function refreshOperations() {
  updateTag('orders')
  updateTag('reservations')
  updateTag('tables')
  updateTag('admin-dashboard')
}
