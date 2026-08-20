import { businessConfig } from '@/config/business'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils/currency'

interface PriceProps {
  amount: number
  currency?: string
  className?: string
  symbolClassName?: string
}

export function Price({
  amount,
  currency,
  className,
  symbolClassName,
}: PriceProps) {
  const isAfter = businessConfig.currencyPositionAfter

  const symbolNode = (
    <span className={cn('text-xs font-normal font-sans', symbolClassName)}>
      {businessConfig.currencySymbol}
    </span>
  )

  return (
    <span
      className={cn('font-sans font-bold', className)}
      suppressHydrationWarning
    >
      {!isAfter && <>{symbolNode} </>}
      {formatPrice(amount, currency)}
      {isAfter && <> {symbolNode}</>}
    </span>
  )
}
