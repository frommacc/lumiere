import { formatCurrency } from '@/lib/utils/order'

interface SummaryCardProps {
  subtotal: number
  deliveryFee: number
  total: number
}

export function OrderSummaryCard({
  subtotal,
  deliveryFee,
  total,
}: SummaryCardProps) {
  return (
    <div className='bg-card p-6 md:p-8 rounded-lg border border-border/30'>
      <h4 className='text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-6'>        Account overview
      </h4>
      <div className='space-y-3 text-sm'>
        <div className='flex justify-between items-center text-muted-foreground'>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className='flex justify-between items-center text-muted-foreground'>
          <span>Delivery</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>
        <div className='pt-4 mt-4 border-t border-border/30 flex justify-between items-center text-lg font-bold'>
          <span className='text-foreground'>In total</span>
          <span className='text-primary'>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
