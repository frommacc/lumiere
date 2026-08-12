import { updateTag } from 'next/cache'

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string }

export const forbidden = (): ActionResult => ({
  success: false,
  message: 'You do not have permission for this action.',
})

export const unauthorized = (): ActionResult => ({
  success: false,
  message: 'You must be logged in for this action.',
})

export const serverError = (
  message = 'An error occurred, please try again.',
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
