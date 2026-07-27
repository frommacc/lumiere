'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, UserIcon } from 'lucide-react'

import { useReservationStore } from '@/store/useReservationStore'
import { useCartStore } from '@/store/useCartStore'
import { useSession } from '@/lib/auth-client'
import { NAV_LINKS } from '@/lib/constants/nav-constants'

import { UserMenu } from '../Users/UserMenu'
import { Skeleton } from '../ui/skeleton'
import { MobileNav } from './MobileNav'

export default function Navbar() {
  const { data: session, isPending } = useSession()
  const { openReservation } = useReservationStore()
  const pathname = usePathname()

  const hasHydrated = useCartStore((state) => state._hasHydrated)
  const { getTotalCount } = useCartStore()
  const openCart = useCartStore((state) => state.openCart)

  const cartCount = getTotalCount()

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20'>
      <div className='flex justify-between items-center px-6 xl:px-16 py-4 max-w-7xl mx-auto'>
        {/* Logo */}
        <Link
          href='/'
          className='font-mono text-2xl font-bold text-primary tracking-widest uppercase transition-opacity hover:opacity-90'
        >
          LUMIÈRE
        </Link>

        {/* Desktop Navigation Links */}
        <div className='hidden xl:flex items-center space-x-8'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='font-sans text-xs uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300'
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-6'>
          {/* Универзално копче за кошничка (се прикажува и на mobile и на desktop) */}
          <button
            onClick={openCart}
            className='group relative text-foreground hover:text-primary transition-colors duration-300'
            aria-label='Отвори ја кошничката'
          >
            <ShoppingBag size={26} />
            {hasHydrated && cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse group-hover:animate-none'>
                {cartCount}
              </span>
            )}
          </button>

          {/* Desktop User Menu */}
          <div className='hidden xl:block'>
            {isPending ? (
              <Skeleton className='w-8 h-8 rounded-full' />
            ) : session ? (
              <UserMenu user={session.user} />
            ) : (
              <Link href={`/login?redirect_url=${pathname}`}>
                <UserIcon size={26} />
              </Link>
            )}
          </div>

          {/* Desktop кнопка за резервација */}
          <button
            onClick={openReservation}
            className='hidden xl:block bg-primary hover:bg-primary-container text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold px-6 py-2.5 active:scale-95 transition-all duration-300'
          >
            Резервација
          </button>

          {/* Mobile Drawer trigger (само на mobile) */}
          <MobileNav
            session={session}
            isPending={isPending}
            pathname={pathname}
            openReservation={openReservation}
          />
        </div>
      </div>
    </nav>
  )
}
