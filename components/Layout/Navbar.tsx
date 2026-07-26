'use client'

import { useState } from 'react'
import { Menu, X, Calendar, ShoppingBag, UserIcon } from 'lucide-react'
import { useReservationStore } from '@/store/useReservationStore'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { UserMenu } from '../Users/UserMenu'
import { Skeleton } from '../ui/skeleton'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session, isPending } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { openReservation } = useReservationStore()

  const pathname = usePathname()
  // Ги земаме состојбите од Cart Store
  const hasHydrated = useCartStore((state) => state._hasHydrated)
  const getTotalCount = useCartStore((state) => state.getTotalCount)
  const openCart = useCartStore((state) => state.openCart)

  const cartCount = getTotalCount()

  const navLinks = [
    { label: 'Специјалитети', href: '/#specialties' },
    { label: 'Мени', href: '/menu' },
    { label: 'За Нас', href: '/#about' },
    { label: 'Препораки', href: '/#reviews' },
    { label: 'Контакт', href: '/#contact' },
  ]

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20'>
      <div className='flex justify-between items-center px-6 xl:px-16 py-4 max-w-7xl mx-auto'>
        {/* Logo */}
        <Link
          href='/'
          className='font-display text-2xl font-bold text-primary tracking-widest uppercase transition-opacity hover:opacity-90'
        >
          LUMIÈRE
        </Link>

        {/* Desktop Links */}
        <div className='hidden xl:flex items-center space-x-8'>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='font-sans text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300'
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          {/* USER MENU */}
          <div>
            {isPending ? (
              <Skeleton className='w-8 h-8 rounded-full' />
            ) : session ? (
              <UserMenu user={session.user} />
            ) : (
              <Link href={`/login?redirect_url=${pathname}`}>
                <UserIcon size={24} />
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className='hidden xl:flex items-center gap-4'>
            <button
              onClick={openCart}
              className='relative p-2 text-foreground hover:text-primary transition-colors duration-300'
              aria-label='Отвори ја кошничката'
            >
              <ShoppingBag size={20} />
              {/* Баџот се прикажува САМО кога localStorage ќе се вчита */}
              {hasHydrated && cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={openReservation}
              className='bg-primary hover:bg-primary-container text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold px-6 py-2.5 active:scale-95 transition-all duration-300'
            >
              Резервирај Маса
            </button>
          </div>

          {/* Mobile Icons Toggle */}
          <div className='flex items-center space-x-4 xl:hidden'>
            <button
              onClick={openCart}
              className='relative p-2'
              aria-label='Отвори ја кошничката'
            >
              <ShoppingBag size={20} />
              {hasHydrated && cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-surface-variant hover:text-primary transition-colors'
              aria-label='Мени'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className='xl:hidden border-t border-outline-variant/15 bg-surface/95 backdrop-blur-2xl'>
          <div className='flex flex-col space-y-4 p-6'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className='font-sans text-sm uppercase tracking-wider hover:text-primary transition-colors'
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false)
                openReservation()
              }}
              className='w-full mt-2 bg-primary text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold py-3 flex items-center justify-center gap-2'
            >
              <Calendar size={16} />
              Резервирај Маса
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
