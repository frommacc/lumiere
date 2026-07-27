import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export function EmptyOrdersState() {
  return (
    <div className='flex flex-col items-center text-center mt-10 py-16 space-y-4 border border-dashed border-outline-variant/30 rounded-2xl'>
      <ShoppingBag size={64} />

      <p className='font-headline-sm text-foreground'>
        Сè уште немате направено ниту една нарачка.
      </p>
      <Link
        href='/menu'
        className='inline-block py-3 px-8 bg-primary text-primary-foreground uppercase tracking-widest hover:brightness-110 transition-all'
      >
        Погледни Мени
      </Link>
    </div>
  )
}
