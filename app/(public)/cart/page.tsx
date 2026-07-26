'use client'

import { useCartStore } from '@/store/useCartStore'

import Link from 'next/link'
import { useHasMounted } from '@/hooks/useHasMounted'
import { CartHeader } from '@/components/Cart/CartHeader'
import { CartItem } from '@/components/Cart/CartItem'
import { ChefNotes } from '@/components/Cart/ChefNotes'
import { OrderSummary } from '@/components/Cart/OrderSummary'
import { ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const cart = useCartStore((state) => state.cart)
  const isMounted = useHasMounted()

  // Додека се рендира на сервер/хидрира, прикажи loading
  if (!isMounted) {
    return (
      <main className='min-h-screen w-full bg-background text-foreground pt-20 flex items-center justify-center'>
        <div className='animate-pulse text-muted-foreground uppercase text-xs tracking-widest'>
          Вчитување...
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen w-full bg-background text-foreground pt-20'>
      <div className='max-w-7xl mx-auto px-5 md:px-16 py-12 lg:py-20 w-full'>
        <CartHeader />

        {cart.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center gap-6'>
            <ShoppingBag size={100} />
            <p className='font-mono text-2xl text-foreground'>
              Вашата кошничка е празна
            </p>
            <Link
              href='/menu'
              className='bg-primary text-primary-foreground font-semibold px-8 py-4 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity'
            >
              Разгледај Мени
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 items-start'>
            {/* Лева колона: Производи */}
            <div className='lg:col-span-7 flex flex-col gap-12'>
              <div className='flex flex-col'>
                {cart.map((item) => (
                  <CartItem key={item.menuItem.id} item={item} />
                ))}
              </div>
              <ChefNotes />
            </div>

            {/* Десна колона: Преглед и плаќање */}
            <OrderSummary />
          </div>
        )}
      </div>

      <div className='fixed top-0 right-0 -z-10 pointer-events-none opacity-20 overflow-hidden w-full h-full'>
        <div className='absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse' />
        <div className='absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[100px]' />
      </div>
    </main>
  )
}
