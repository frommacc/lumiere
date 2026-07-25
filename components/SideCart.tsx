'use client'
import React, { useState } from 'react'
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Truck,
  Gift,
  Compass,
} from 'lucide-react'
import { motion } from 'motion/react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Image from 'next/image'
import { useCartStore } from '@/store/useCartStore'

export default function SideCart() {
  const { isOpen, closeCart, cart, updateQuantity, removeItem, clearCart } =
    useCartStore()

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(
    'delivery',
  )
  const [isOrdered, setIsOrdered] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = cart.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0,
  )
  const deliveryFee = deliveryType === 'delivery' ? 150 : 0
  const total = subtotal + deliveryFee

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const code = 'LUM-ORD-' + Math.floor(10000 + Math.random() * 90000)
    setOrderId(code)
    setIsOrdered(true)
  }

  const handleResetAndClose = () => {
    if (isOrdered) {
      clearCart()
      setIsOrdered(false)
    }
    setAddress('')
    setPhone('')
    setNotes('')
    closeCart()
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && handleResetAndClose()}
    >
      <SheetContent className='w-full max-w-md bg-surface border-l border-outline-variant/30 p-0 flex flex-col z-50 shadow-2xl [&>button]:hidden'>
        {/* Header */}
        <SheetHeader className='flex flex-row justify-between items-center px-6 py-5 border-b border-outline-variant/20 space-y-0'>
          <div className='flex items-center gap-2'>
            <ShoppingBag size={18} className='text-primary' />
            <SheetTitle className='font-display text-lg font-bold text-on-surface uppercase tracking-wider'>
              Вашата Нарачка
            </SheetTitle>
          </div>
          <button
            onClick={handleResetAndClose}
            className='text-on-surface-variant hover:text-primary p-1 transition-colors'
          >
            <X size={20} />
          </button>
        </SheetHeader>

        {/* Dynamic content */}
        {!isOrdered ? (
          <>
            {cart.length === 0 ? (
              /* Empty state */
              <div className='flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4'>
                <div className='w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center text-outline-variant'>
                  <ShoppingBag size={28} />
                </div>
                <h4 className='font-display text-lg font-semibold text-on-surface'>
                  Кошничката е празна
                </h4>
                <p className='font-sans text-xs text-on-surface-variant max-w-xs mx-auto'>
                  Изберете некој од нашите премиум специјалитети и задоволства
                  за да го додадете во кошничката.
                </p>
                <button
                  onClick={closeCart}
                  className='bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 px-6 py-2.5 text-xs uppercase tracking-wider font-sans font-semibold rounded-sm transition-all cursor-pointer'
                >
                  Прелистај Мени
                </button>
              </div>
            ) : (
              /* Items list and checkout details */
              <form
                onSubmit={handlePlaceOrder}
                className='flex-1 flex flex-col overflow-hidden'
              >
                {/* Items List */}
                <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                  <p className='text-[10px] font-sans font-bold uppercase tracking-widest text-primary border-b border-outline-variant/10 pb-2'>
                    Избрани Специјалитети (
                    {cart.reduce((a, c) => a + c.quantity, 0)})
                  </p>

                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className='flex gap-4 bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/10'
                    >
                      <div className='relative w-16 h-16 rounded-md object-cover border border-outline-variant/20 overflow-hidden'>
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
                          <span className='font-sans text-xs font-bold text-primary shrink-0'>
                            {(
                              item.menuItem.price * item.quantity
                            ).toLocaleString()}{' '}
                            ден
                          </span>
                        </div>

                        {/* Controls */}
                        <div className='flex justify-between items-center mt-2'>
                          <div className='flex items-center gap-2 border border-outline-variant/30 rounded px-1 py-0.5 bg-surface'>
                            <button
                              type='button'
                              onClick={() =>
                                updateQuantity(
                                  item.menuItem.id,
                                  item.quantity - 1,
                                )
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
                                updateQuantity(
                                  item.menuItem.id,
                                  item.quantity + 1,
                                )
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
                            title='Избриши од кошничка'
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Delivery preference */}
                  <div className='pt-4 space-y-3'>
                    <p className='text-[10px] font-sans font-bold uppercase tracking-widest text-primary border-b border-outline-variant/10 pb-2'>
                      Начин на Испорака
                    </p>
                    <div className='grid grid-cols-2 gap-2'>
                      <button
                        type='button'
                        onClick={() => setDeliveryType('delivery')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded text-xs font-sans transition-all border cursor-pointer ${
                          deliveryType === 'delivery'
                            ? 'bg-primary/5 border-primary text-on-surface font-semibold'
                            : 'border-outline-variant/20 text-on-surface-variant'
                        }`}
                      >
                        <Truck size={14} />
                        Брза Достава
                      </button>
                      <button
                        type='button'
                        onClick={() => setDeliveryType('pickup')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded text-xs font-sans transition-all border cursor-pointer ${
                          deliveryType === 'pickup'
                            ? 'bg-primary/5 border-primary text-on-surface font-semibold'
                            : 'border-outline-variant/20 text-on-surface-variant'
                        }`}
                      >
                        <Compass size={14} />
                        Подигни Сам
                      </button>
                    </div>
                  </div>

                  {/* Checkout inputs */}
                  <div className='space-y-3 pt-2'>
                    {deliveryType === 'delivery' ? (
                      <div>
                        <input
                          type='text'
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder='Адреса за испорака (Скопје)'
                          className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                        />
                      </div>
                    ) : (
                      <div className='bg-surface-container-high/50 p-2 text-[11px] text-on-surface-variant/95 border border-outline-variant/25 rounded'>
                        📌 Подигнувањето е на Ул. Македонија Бр. 1, Скопје во
                        секое време за 30 минути.
                      </div>
                    )}

                    <div>
                      <input
                        type='tel'
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder='Контакт телефон'
                        className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                      />
                    </div>

                    <div>
                      <input
                        type='text'
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder='Напомена за кујната (алергии, прибор, итн.)'
                        className='w-full bg-transparent border-b border-outline-variant/30 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary'
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Totals block */}
                <div className='bg-surface-container-high p-6 border-t border-outline-variant/20 space-y-4'>
                  <div className='space-y-1.5 text-xs font-sans'>
                    <div className='flex justify-between text-on-surface-variant'>
                      <span>Сума:</span>
                      <span>{subtotal.toLocaleString()} ден</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className='flex justify-between text-on-surface-variant'>
                        <span>Достава:</span>
                        <span>{deliveryFee.toLocaleString()} ден</span>
                      </div>
                    )}
                    <div className='flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/15'>
                      <span>Вкупно за плаќање:</span>
                      <span className='text-primary'>
                        {total.toLocaleString()} ден
                      </span>
                    </div>
                  </div>

                  <button
                    type='submit'
                    className='w-full bg-primary hover:bg-primary-container text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold py-4 active:scale-95 transition-all duration-300 cursor-pointer'
                  >
                    ПЛАТИ И ИСПРАТИ НАРАЧКА
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Order confirmation success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex-1 p-6 flex flex-col justify-center items-center text-center space-y-6'
          >
            <div className='w-16 h-16 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary animate-pulse'>
              <Gift size={32} />
            </div>

            <div className='space-y-2'>
              <h4 className='font-display text-xl font-bold text-on-surface'>
                Нарачката е прифатена!
              </h4>
              <p className='font-sans text-xs text-on-surface-variant max-w-sm'>
                Вашата кулинарска нарачка е пренесена до нашите шефови во
                кујната.
              </p>
            </div>

            <div className='w-full border border-outline-variant/20 rounded-lg p-4 bg-surface-container-high/60 text-left text-xs font-sans space-y-2'>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>
                  Шифра на нарачка:
                </span>
                <span className='font-mono font-bold text-primary'>
                  {orderId}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant font-medium'>
                  Време на подготовка:
                </span>
                <span className='font-bold text-on-surface'>35 - 45 мин.</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-on-surface-variant'>Статус:</span>
                <span className='text-green-400 font-bold'>
                  Се подготвува 👨‍🍳
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className='bg-primary text-primary-foreground w-full font-sans text-xs uppercase tracking-widest font-semibold py-3.5 hover:bg-primary-container transition-all cursor-pointer'
            >
              ОК, ЗАТВОРИ
            </button>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  )
}
