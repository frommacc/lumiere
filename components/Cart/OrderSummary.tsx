// OrderSummary.tsx
'use client'

import { Lock, Clock } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { DeliveryAndPayment } from './DeliveryAndPayment'
import { DELIVERY_CONFIG } from '@/lib/constants/delivery'

export const OrderSummary = () => {
  // We pull all the necessary values and functions directly from the Zustand store
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee)
  const deliveryMethod = useCartStore((state) => state.deliveryMethod)

  const itemsTotal = getTotalPrice()
  const deliveryFee = getDeliveryFee()
  const total = itemsTotal + deliveryFee

  // Calculation of how many more denars he needs for free delivery
  const remainingForFreeDelivery =
    DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD - itemsTotal

  return (
    <div className='lg:col-span-5 sticky top-28'>
      <div className='bg-surface-container p-8 md:p-12 relative overflow-hidden group border border-outline-variant/20'>
        <div className='absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none' />
        <h2 className='font-mono text-3xl font-semibold text-foreground mb-10 relative'>          View Order
        </h2>        {/* View sums */}
        <div className='flex flex-col gap-6 mb-10 relative'>
          <div className='flex justify-between items-center'>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-widest'>              Total products
            </span>
            <div className='grow mx-4 border-b border-dotted border-outline-variant/30' />
            <span className='text-lg text-foreground'>
              {itemsTotal.toLocaleString()} $
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-widest'>              Delivery
            </span>
            <div className='grow mx-4 border-b border-dotted border-outline-variant/30' />
            <span className='text-base text-foreground font-semibold'>
              {deliveryFee === 0 ? (
                <span className='text-primary'>FREE</span>
              ) : (
                `${deliveryFee} $`
              )}
            </span>
          </div>

          {/* Message for free delivery if there are still denars missing */}
          {deliveryMethod !== 'PICKUP' && remainingForFreeDelivery > 0 && (
            <div className='text-[11px] text-muted-foreground bg-primary/5 p-3 border border-primary/20 rounded-xs'>              Add more{' '}
              <strong className='text-primary font-bold'>
                {remainingForFreeDelivery.toLocaleString()} $
              </strong>{' '}
              for free shipping!
            </div>
          )}

          <div className='pt-6 border-t border-outline-variant/20 flex justify-between'>
            <span className='font-mono text-xl text-primary uppercase tracking-tighter font-semibold'>              Total for payment
            </span>
            <div className='text-right'>
              <span className='font-mono text-3xl font-bold text-foreground leading-0.5'>
                {total.toLocaleString()}
              </span>
              <span className='text-xs text-muted-foreground block uppercase tracking-widest font-semibold'>
                $
              </span>
            </div>
          </div>          {/* Promo code entry */}
          <div className='mt-4 relative'>
            <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>              Promotional code
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Enter code...'
                className='grow bg-transparent border-b border-outline-variant/50 py-2 text-foreground focus:outline-none focus:border-primary transition-colors'
              />
              <button
                type='button'
                className='text-[10px] text-primary uppercase tracking-widest hover:opacity-80 transition-opacity font-semibold'
              >                Apply
              </button>
            </div>
          </div>
        </div>        {/* Shipping and payment form */}
        <DeliveryAndPayment />
      </div>      {/* Security Indicators */}
      <div className='mt-8 flex justify-between px-4 opacity-40 grayscale'>
        <div className='flex items-center gap-2'>
          <Lock className='w-4 h-4' />
          <span className='text-[9px] uppercase tracking-widest font-semibold'>            Secure payment
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          <span className='text-[9px] uppercase tracking-widest font-semibold'>            35-45 min. delivery
          </span>
        </div>
      </div>
    </div>
  )
}
