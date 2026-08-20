'use client'

import { X, Plus, Minus, Trash2, ShoppingBag, Store, Truck } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Image from 'next/image'
import { useCartStore } from '@/store/useCartStore'
import { calculateDeliveryFee } from '@/lib/constants/delivery'
import Link from 'next/link'
import { Price } from './shared/Price'

export default function SideCart() {
  const {
    isOpen,
    closeCart,
    cart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalCount,
    deliveryMethod,
    setDeliveryMethod,
  } = useCartStore()

  const itemsTotal = getTotalPrice()
  const deliveryFee = calculateDeliveryFee(itemsTotal, deliveryMethod)
  const total = itemsTotal + deliveryFee

  //  const code = 'LUM-ORD-' + Math.floor(10000 + Math.random() * 90000)

  const handleResetAndClose = () => {
    closeCart()
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && handleResetAndClose()}
    >
      <SheetContent className='w-[90%]! max-w-md bg-surface border-l border-outline-variant/30 p-0 flex flex-col z-50 shadow-2xl [&>button]:hidden'>
        {/* Header */}
        <SheetHeader className='flex flex-row justify-between items-center px-6 py-5 border-b border-outline-variant/20 space-y-0'>
          <div className='flex items-center gap-2'>
            <ShoppingBag size={18} className='text-primary' />
            <SheetTitle className='font-display text-lg font-bold text-on-surface uppercase tracking-wider'>
              {' '}
              Your Order
            </SheetTitle>
          </div>
          <button
            onClick={handleResetAndClose}
            className='text-on-surface-variant hover:text-primary p-1 transition-colors'
          >
            <X size={20} />
          </button>
        </SheetHeader>

        {cart.length === 0 ? (
          /* Empty state */
          <div className='flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4'>
            <div className='w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-outline-variant'>
              <ShoppingBag size={28} />
            </div>
            <h4 className='font-display text-lg font-semibold text-on-surface'>
              {' '}
              The basket is empty
            </h4>
            <p className='font-sans text-xs text-on-surface-variant max-w-xs mx-auto'>
              {' '}
              Choose from our premium specialties and treats to add it to the
              cart.
            </p>
            <button
              onClick={closeCart}
              className='bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 px-6 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold rounded-sm transition-all cursor-pointer'
            >
              {' '}
              Browse Menu
            </button>
          </div>
        ) : (
          /* Items list and checkout details */
          <div className='flex-1 flex flex-col overflow-hidden'>
            {/* Items List */}
            <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4'>
              <p className='text-[10px] font-sans font-bold uppercase tracking-widest text-primary border-b border-outline-variant/10 pb-2'>
                {' '}
                Selected Specialties ({getTotalCount()})
              </p>

              {cart.map((item) => (
                <div
                  key={item.menuItem.id}
                  className='flex gap-4 bg-surface-container-high/40 p-3 border border-outline-variant/10'
                >
                  <div className='relative w-16 h-16 object-cover border border-outline-variant/20 overflow-hidden'>
                    <Image
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className='object-cover'
                      fill
                    />
                  </div>

                  <div className='flex-1 flex flex-col justify-between'>
                    <div className='flex justify-between items-start gap-1'>
                      <h4 className='font-display text-sm font-semibold text-on-surface'>
                        {item.menuItem.name}
                      </h4>

                      <Price
                        amount={item.menuItem.price * item.quantity}
                        className='text-xs text-primary shrink-0'
                      />
                    </div>

                    {/* Controls */}
                    <div className='flex justify-between items-center mt-2'>
                      <div className='flex items-center gap-2 border border-outline-variant/30 rounded px-1 py-0.5 bg-surface'>
                        <button
                          type='button'
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity - 1)
                          }
                          className='text-on-surface-variant hover:text-primary p-0.5'
                        >
                          <Minus size={12} />
                        </button>
                        <span className='text-xs font-sans font-semibold w-5 text-center text-on-surface'>
                          {item.quantity}
                        </span>
                        <button
                          type='button'
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity + 1)
                          }
                          className='text-on-surface-variant hover:text-primary p-0.5'
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type='button'
                        onClick={() => removeItem(item.menuItem.id)}
                        className='text-on-surface-variant/70 hover:text-red-400 p-1'
                        title='Delete from cart'
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>{' '}
            {/* Select delivery method */}
            <div className='hidden md:block space-y-4 p-6'>
              <label className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block'>
                {' '}
                Shipping method
              </label>
              <div className='grid gap-4 grid-cols-2'>
                <label className='relative cursor-pointer group'>
                  <input
                    type='radio'
                    name='delivery_method'
                    checked={deliveryMethod === 'ADDRESS'}
                    onChange={() => setDeliveryMethod('ADDRESS')}
                    className='peer hidden'
                  />
                  <div className='p-4 border border-outline-variant/30 bg-surface-container-high/40 peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 rounded-xs'>
                    <Truck className='w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors' />
                    <span className='text-[10px] text-outline uppercase font-semibold text-center'>
                      {' '}
                      Delivery to address
                    </span>
                  </div>
                </label>

                <label className='relative cursor-pointer group'>
                  <input
                    type='radio'
                    name='delivery_method'
                    checked={deliveryMethod === 'PICKUP'}
                    onChange={() => setDeliveryMethod('PICKUP')}
                    className='peer hidden'
                  />
                  <div className='p-4 border border-outline-variant/30 bg-surface-container-high/40 peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 rounded-xs'>
                    <Store className='w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors' />
                    <span className='text-[10px] text-outline uppercase font-semibold text-center'>
                      {' '}
                      Pickup
                    </span>
                  </div>
                </label>
              </div>
            </div>
            {/* Footer Totals block */}
            <div className='bg-surface-container-high p-6 border-t border-outline-variant/20 space-y-4'>
              <div className='space-y-1.5 text-xs font-sans'>
                <div className='flex justify-between text-on-surface-variant'>
                  <span>Amount:</span>
                  <Price amount={itemsTotal} className='font-normal' />
                </div>

                <div className='flex justify-between text-on-surface-variant'>
                  <span>Delivery:</span>
                  <Price amount={deliveryFee} className='font-normal' />
                </div>

                <div className='flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/15'>
                  <span>Total to pay:</span>
                  <Price amount={total} className='text-primary' />
                </div>
              </div>

              <Link
                href='/cart'
                onClick={closeCart}
                className='w-full flex justify-center bg-primary hover:bg-primary-container text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold py-4 active:scale-95 transition-all duration-300 cursor-pointer'
              >
                {' '}
                START ORDERING
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
