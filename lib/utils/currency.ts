import { businessConfig } from '@/config/business'

/**
 * Returns the number of minor currency units used by a currency.
 *
 * Examples:
 * USD -> 2
 * EUR -> 2
 * JPY -> 0
 * BHD -> 3
 */
export function getCurrencyMinorUnits(currency: string): number {
  return (
    new Intl.NumberFormat(businessConfig.locale, {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 0
  )
}

/**
 * Converts a display price into minor currency units
 *
 * Example:
 * EUR 1650.50 -> 165050
 * JPY 1650 -> 1650
 */
export function priceToMinorUnits(
  price: number | string,
  currency: string = businessConfig.currency,
): number {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid price: ${price}`)
  }

  const minorUnits = getCurrencyMinorUnits(currency)

  return Math.round(value * 10 ** minorUnits)
}

/**
 * Converts minor currency units back to a normal price
 *
 * Example:
 * 165050 EUR -> 1650.50
 * 1650 JPY -> 1650
 */
export function minorUnitsToPrice(
  amount: number,
  currency: string = businessConfig.currency,
): number {
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid amount: ${amount}`)
  }

  const minorUnits = getCurrencyMinorUnits(currency)

  return amount / 10 ** minorUnits
}

/**
 * Formats a minor-unit amount using the configured locale and currency.
 *
 * Example:
 * 165050 EUR -> 1.650,50 €
 * 165050 USD -> $1,650.50
 */
export function formatPrice(
  amount: number,
  currency: string = businessConfig.currency,
  locale: string = businessConfig.locale,
): string {
  const price = minorUnitsToPrice(amount, currency)

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: getCurrencyMinorUnits(currency),
  }).format(price)

  return formattedNumber
}

/**
 * Formats a normal decimal price for an input field.
 *
 * Example:
 * 1650.5 -> 1,650.50
 */
export function formatPriceInput(
  price: number | string,
  currency: string = businessConfig.currency,
  locale: string = businessConfig.locale,
): string {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return ''
  }

  const minorUnits = getCurrencyMinorUnits(currency)

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: minorUnits,
    maximumFractionDigits: minorUnits,
  }).format(value)
}
