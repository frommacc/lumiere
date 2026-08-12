import React from 'react'

export const CartHeader = () => {
  return (
    <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6'>
      <div className='relative'>
        <span className='font-sans text-xs font-semibold text-primary mb-4 block tracking-[0.4em] uppercase'>          Your Choice
        </span>
        <h1 className='font-mono text-4xl md:text-6xl font-bold text-foreground'>          Basket
        </h1>
        <div className='absolute -left-8 top-1/2 -translate-y-1/2 w-px h-24 bg-linear-to-b from-transparent via-primary/40 to-transparent hidden md:block' />
      </div>
      <div className='flex items-center gap-4 text-outline text-[10px] tracking-widest uppercase mb-2 font-semibold'>
        <span>01 Overview</span>
        <span className='w-8 h-px bg-outline-variant' />
        <span className='text-muted-foreground'>02 Payment</span>
      </div>
    </div>
  )
}
