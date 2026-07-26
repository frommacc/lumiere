'use client'

import Image from 'next/image'
import { CartItem as CartItemType } from '@/types/default'
import { useCartStore } from '@/store/useCartStore'
import { Minus, Plus, X } from 'lucide-react'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const { menuItem, quantity } = item

  return (
    <div className='group relative py-8 flex gap-6 md:gap-10 items-center border-b border-outline-variant/20 transition-all hover:bg-surface-container/30 px-4 -mx-4 duration-700'>
      <div className='relative w-24 h-24 md:w-32 md:h-32 overflow-hidden bg-surface-container shrink-0'>
        <Image
          src={menuItem.image}
          alt={menuItem.name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors' />
      </div>

      <div className='grow flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='max-w-xs'>
          <h3 className='font-mono text-lg font-semibold text-foreground mb-1 text-ellipsis line-clamp-2'>
            {menuItem.name}
          </h3>
        </div>

        <div className='flex items-center gap-8'>
          {/* Контрола за количина */}
          <div className='flex items-center border border-outline-variant/30 px-3 py-1 gap-4'>
            <button
              className='text-muted-foreground hover:text-primary transition-colors p-1'
              onClick={() => updateQuantity(menuItem.id, quantity - 1)}
              type='button'
            >
              <Minus size={16} />
            </button>
            <span className='text-sm font-medium text-foreground w-4 text-center'>
              {quantity}
            </span>
            <button
              className='text-muted-foreground hover:text-primary transition-colors p-1'
              onClick={() => updateQuantity(menuItem.id, quantity + 1)}
              type='button'
            >
              <Plus size={16} />
            </button>
          </div>

          <div className='text-right min-w-20'>
            <p className='font-mono text-xl font-semibold text-foreground'>
              {(menuItem.price * quantity).toLocaleString()}
            </p>
            <p className='text-[10px] text-outline uppercase font-semibold'>
              MKD
            </p>
          </div>
        </div>
      </div>

      <button
        type='button'
        onClick={() => removeItem(menuItem.id)}
        className='absolute top-4 right-4 md:relative md:top-0 md:right-0 opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-destructive p-1'
      >
        <X size={18} />
      </button>
    </div>
  )
}
