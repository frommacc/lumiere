'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Truck,
  Store,
  Banknote,
  CreditCard,
  ArrowRight,
  LogIn,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { createOrder } from '@/actions/order'
import { useSession } from '@/lib/auth-client'
import { AddressAutocomplete } from './AddressAutocomplete'
import { DeliveryAddressPicker } from './DeliveryAddressPicker'
import { GoogleMapsProvider } from '@/components/providers/google-maps-provider'

// The main component that manages a session
export function DeliveryAndPayment() {
  const { data: session, isPending: isSessionLoading } = useSession()
  const user = session?.user

  // 1. Loading state
  if (isSessionLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground'>
        <Loader2 className='w-6 h-6 animate-spin text-primary' />
        <span className='text-xs uppercase tracking-widest font-medium'>          Checking session...
        </span>
      </div>    )
  }

  // 2. If the user is NOT logged in
  if (!user) {
    return (
      <div className='p-8 text-center border border-outline-variant/30 bg-surface-container-high/20 rounded-xs space-y-6'>
        <div className='space-y-2'>
          <h3 className='text-base font-semibold text-foreground uppercase tracking-wider'>            Login required
          </h3>
          <p className='text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto'>            To continue processing your order at Lumiere, you
            please login to your profile.
          </p>
        </div>

        <Link
          href='/login?redirect_url=/cart'
          className='inline-flex items-center justify-center gap-3 w-full bg-primary py-4 px-6 text-xs text-primary-foreground font-semibold tracking-[0.2em] uppercase transition-transform active:scale-[0.98] hover:opacity-90'
        >
          <LogIn className='w-4 h-4' />
          <span>Log in to order</span>
        </Link>
      </div>
    )
  }

  return (
    <GoogleMapsProvider>
      <DeliveryAndPaymentForm key={user.id} user={user} />
    </GoogleMapsProvider>  )
}

// Internal component for the form
function DeliveryAndPaymentForm({
  user,
}: {
  user: { name: string; phone?: string | null }
}) {
  const router = useRouter()
  const {
    cart,
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
  } = useCartStore()

  const [isPending, startTransition] = useTransition()

  // The address and coordinate data
  const [address, setAddress] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [ coords , setCoords ] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [phone, setPhone] = useState(user.phone || '')

  // When selecting a street/neighborhood from Google Autocomplete
  const handleStreetSelect = (
    selectedAddress: string,
    lat?: number,
    lng?: number,
  ) => {
    setAddress(selectedAddress)
    if (lat && lng) {
      setCoords({ lat, lng })
    }
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('The basket is empty!')
      return
    }

    const fullAddress = addressDetails
      ? `${address}, ${addressDetails}`
      : address

    const orderPayload = {
      deliveryMethod,
      paymentMethod,
      phone,
      deliveryAddress: fullAddress,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      notes: '',
      items: cart.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
      })),
    }

    startTransition(async () => {
      const response = await createOrder(orderPayload)

      if (!response.success) {
        if (response.issues && response.issues.length > 0) {
          response.issues.forEach((issue) => {
            if (issue.reason === 'PRICE_CHANGED') {
              toast.warning(
                `The price for "${issue.name}" has changed from ${issue.oldPrice} to ${issue.newPrice} $. The shopping cart has been updated.`,
              )
            } else if (issue.reason === 'ITEM_UNAVAILABLE') {
              toast.error(issue.message)
            }
          })
        } else {
          toast.error(
            response.message || 'An error occurred while creating the order.',
          )
        }
        return
      }

      toast.success(`The order has been successfully sent! (#${response.orderNumber})`)
      router.push(`/profile/orders/${response.orderNumber}`)
      setTimeout(() => {
        clearCart()
      }, 600)
    })
  }

  return (
    <form onSubmit={handleOrderSubmit} className='space-y-8 relative'>
      <div className='space-y-6'>        {/* Select delivery method */}
        <div className='space-y-4 mb-8'>
          <label className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block'>            Shipping method
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
                <span className='text-[10px] text-outline uppercase font-semibold text-center'>                  Delivery to address
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
                <span className='text-[10px] text-outline uppercase font-semibold text-center'>                  Personal training
                </span>
              </div>
            </label>
          </div>
        </div>        {/* Customer information */}
        <div className='relative group border-b border-outline-variant/30 pb-2'>
          <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>            Customer name
          </label>
          <p className='text-foreground font-medium text-sm'>{user.name}</p>
        </div>

        {deliveryMethod !== 'PICKUP' && (
          <div className='space-y-4'>            {/* Google Autocomplete for Street / Neighborhood */}
            <AddressAutocomplete
              value={address}
              onChange={handleStreetSelect}
              disabled={isPending}
            />            {/* Text field for Number, Entrance, Apartment (does not affect map coordinates) */}
            <div>
              <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>                Number / Entrance / Flat / Floor
              </label>
              <input
                type='text'
                required={deliveryMethod === 'ADDRESS'}
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder='e.g. no. 24, entrance 1, floor 3, apartment 12'
                disabled={isPending}
                className='w-full bg-transparent border-b border-outline-variant/50 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm'
              />
            </div>            {/* Interactive map with Drag & Drop to refine the pin */}
            {coords && (
              <DeliveryAddressPicker
                coords={coords}
                onCoordsChange={(lat, lng) => setCoords({ lat, lng })}
              />
            )}
          </div>
        )}

        <div className='relative group'>
          <label className='text-[10px] text-outline uppercase mb-1 block font-semibold'>            Contact phone number
          </label>
          <input
            type='tel'
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='070 123 456'
            className='w-full bg-transparent border-b border-outline-variant/50 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm'
          />
        </div>
      </div>      {/* Payment method */}
      <div className='space-y-4 pt-4'>
        <label className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block'>          Method of Payment
        </label>
        <div className='grid gap-4 grid-cols-2'>
          <label className='relative cursor-pointer group'>
            <input
              type='radio'
              name='payment'
              checked={paymentMethod === 'CARD'}
              onChange={() => setPaymentMethod('CARD')}
              className='peer hidden'
            />
            <div className='p-4 border border-outline-variant/30 bg-surface-container-high/40 peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 rounded-xs'>
              <CreditCard className='w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors' />
              <span className='text-[10px] text-outline uppercase font-semibold'>                Card
              </span>
            </div>
          </label>

          <label className='relative cursor-pointer group'>
            <input
              type='radio'
              name='payment'
              checked={paymentMethod === 'CASH'}
              onChange={() => setPaymentMethod('CASH')}
              className='peer hidden'
            />
            <div className='p-4 border border-outline-variant/30 bg-surface-container-high/40 peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 rounded-xs'>
              <Banknote className='w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors' />
              <span className='text-[10px] text-outline uppercase font-semibold'>                Cash
              </span>
            </div>
          </label>
        </div>
      </div>      {/* Confirm button */}
      <button
        type='submit'
        disabled={isPending || cart.length === 0}
        className='w-full bg-primary py-6 flex items-center justify-center gap-4 group/btn overflow-hidden relative transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span className='absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out' />
        <span className='text-xs text-primary-foreground font-semibold tracking-[0.2em] uppercase relative z-10 flex items-center gap-2'>
          {isPending ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />              Processing...
            </>          ) : (
            'Confirm Order'
          )}</span>
        {!isPending && (
          <ArrowRight className='w-5 h-5 text-primary-foreground relative z-10 transition-transform group-hover/btn:translate-x-2' />
        )}
      </button>

      <p className='text-center text-[9px] text-outline uppercase tracking-widest opacity-60 font-semibold'>        By confirming you agree to our terms of use
      </p>
    </form>
  )
}
