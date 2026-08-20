// export const businessConfig = {
//   currency: 'MKD',
//   locale: 'mk-MK',
//   currencyDisplay: 'symbol',
//   currencySymbol: 'МКД',
//   currencyPositionAfter: true,
// } as const

export const businessConfig = {
  currency: 'USD',
  locale: 'en-US',
  currencyDisplay: 'symbol',
  currencySymbol: '$',
  currencyPositionAfter: false,
} as const

export type CurrencyCode = typeof businessConfig.currency
