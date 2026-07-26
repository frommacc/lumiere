// OrderSummary.tsx
'use client'

import { Lock, Clock } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { DeliveryAndPayment } from './DeliveryAndPayment'
import { DELIVERY_CONFIG } from '@/lib/constants/delivery'

export const OrderSummary = () => {
  // Сите потребни вредности и функции ги влечеме директно од Zustand store-от
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee)
  const deliveryMethod = useCartStore((state) => state.deliveryMethod)

  const itemsTotal = getTotalPrice()
  const deliveryFee = getDeliveryFee()
  const total = itemsTotal + deliveryFee

  // Пресметка за уште колку денари му требаат за бесплатна достава
  const remainingForFreeDelivery =
    DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD - itemsTotal

  return (
    <div className='lg:col-span-5 sticky top-28'>
      <div className='bg-surface-container p-8 md:p-12 relative overflow-hidden group border border-outline-variant/20'>
        <div className='absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none' />
        <h2 className='font-mono text-3xl font-semibold text-foreground mb-10 relative'>
          Преглед на Нарачка
        </h2>

        {/* Преглед на суми */}
        <div className='flex flex-col gap-6 mb-10 relative'>
          <div className='flex justify-between items-center'>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-widest'>
              Вкупно производи
            </span>
            <div className='grow mx-4 border-b border-dotted border-outline-variant/30' />
            <span className='text-lg text-foreground'>
              {itemsTotal.toLocaleString()} MKD
            </span>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-xs font-semibold text-muted-foreground uppercase tracking-widest'>
              Достава
            </span>
            <div className='grow mx-4 border-b border-dotted border-outline-variant/30' />
            <span className='text-base text-foreground font-semibold'>
              {deliveryFee === 0 ? (
                <span className='text-primary'>БЕСПЛАТНА</span>
              ) : (
                `${deliveryFee} MKD`
              )}
            </span>
          </div>

          {/* Порака за бесплатна достава доколку недостигаат уште денари */}
          {deliveryMethod !== 'PICKUP' && remainingForFreeDelivery > 0 && (
            <div className='text-[11px] text-muted-foreground bg-primary/5 p-3 border border-primary/20 rounded-xs'>
              Додадете уште{' '}
              <strong className='text-primary font-bold'>
                {remainingForFreeDelivery.toLocaleString()} MKD
              </strong>{' '}
              за бесплатна достава!
            </div>
          )}

          <div className='pt-6 border-t border-outline-variant/20 flex justify-between'>
            <span className='font-mono text-xl text-primary uppercase tracking-tighter font-semibold'>
              Вкупно за плаќање
            </span>
            <div className='text-right'>
              <span className='font-mono text-3xl font-bold text-foreground leading-0.5'>
                {total.toLocaleString()}
              </span>
              <span className='text-xs text-muted-foreground block uppercase tracking-widest font-semibold'>
                MKD
              </span>
            </div>
          </div>

          {/* Внос за промо код */}
          <div className='mt-4 relative'>
            <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>
              Промотивен код
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Внесете код...'
                className='grow bg-transparent border-b border-outline-variant/50 py-2 text-foreground focus:outline-none focus:border-primary transition-colors'
              />
              <button
                type='button'
                className='text-[10px] text-primary uppercase tracking-widest hover:opacity-80 transition-opacity font-semibold'
              >
                Примени
              </button>
            </div>
          </div>
        </div>

        {/* Форма за достава и плаќање */}
        <DeliveryAndPayment />
      </div>

      {/* Индикатори за сигурност */}
      <div className='mt-8 flex justify-between px-4 opacity-40 grayscale'>
        <div className='flex items-center gap-2'>
          <Lock className='w-4 h-4' />
          <span className='text-[9px] uppercase tracking-widest font-semibold'>
            Сигурно плаќање
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          <span className='text-[9px] uppercase tracking-widest font-semibold'>
            35-45 мин. достава
          </span>
        </div>
      </div>
    </div>
  )
}
