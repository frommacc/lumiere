'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { signOut } from '@/lib/auth-client'
import { getRoleNavigation } from '@/lib/constants/access-control'
import { getRoleLabel } from '@/lib/constants/user-roles'
import { Role } from '@/lib/generated/prisma'
import { getUserInitials } from '@/lib/utils'

type BackofficeShellProps = {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
    role?: string | null
  }
  children: React.ReactNode
}

function isLinkActive(href: string, pathname: string, allHrefs: string[]) {
  if (pathname === href) return true

  // Не правиме prefix match за dashboard
  if (href === '/admin/dashboard') return false

  // Ако страницата почнува со овој href + '/'
  if (pathname.startsWith(`${href}/`)) {
    // Проверуваме дали има поспецифичен линк од листата што одговара подобро
    const hasMoreSpecificMatch = allHrefs.some(
      (otherHref) =>
        otherHref !== href &&
        otherHref.length > href.length &&
        (pathname === otherHref || pathname.startsWith(`${otherHref}/`)),
    )

    return !hasMoreSpecificMatch
  }

  return false
}

export function BackofficeShell({ user, children }: BackofficeShellProps) {
  const role = (user.role as Role) || Role.USER
  const links = getRoleNavigation(role)
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Проверка дали улогата е KITCHEN

  const signOutUser = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Успешно се одјавивте.')
          router.replace('/')
          router.refresh()
        },
        onError: () => {
          toast.error('Не успеавме да ве одјавиме.')
        },
      },
    })
  }

  const allHrefs = links.map((l) => l.href)

  const navigation = (
    <nav
      className='flex flex-1 flex-col gap-1'
      aria-label='Оперативна навигација'
    >
      {links.map(({ href, label, Icon }) => {
        const active = isLinkActive(href, pathname, allHrefs)
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 border-l-2 px-3 py-3 text-xs font-label-caps uppercase tracking-[0.16em] transition-colors ${
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-high/50 hover:text-on-surface'
            }`}
          >
            <Icon className='size-4 shrink-0' />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  const account = (
    <div className='border-t border-outline-variant/20 pt-4'>
      <div className='mb-4 flex items-center gap-3 px-3'>
        <Avatar className='size-9 border border-primary/20'>
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className='bg-surface-container-high text-xs text-primary'>
            {getUserInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-on-surface'>
            {user.name}
          </p>
          <p className='mt-0.5 font-label-caps text-[9px] uppercase tracking-[0.16em] text-primary'>
            {getRoleLabel(role, true)}
          </p>
        </div>
      </div>
      <Button
        type='button'
        variant='ghost'
        onClick={signOutUser}
        className='w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive'
      >
        <LogOut className='size-4' />
        Одјави се
      </Button>
    </div>
  )

  return (
    <div className='min-h-screen bg-surface text-on-surface lg:grid lg:grid-cols-[17rem_1fr]'>
      <aside className='fixed inset-y-0 left-0 z-40 hidden w-68 flex-col border-r border-outline-variant/20 bg-surface-container-low/85 p-5 backdrop-blur-xl lg:flex'>
        <Link
          href={links[0]?.href ?? '/'}
          className='mb-10 px-3 font-display text-2xl tracking-[0.22em] text-primary'
        >
          LUMIÈRE
        </Link>
        {navigation}
        {account}
      </aside>

      {/* Хедер кој ќе биде видлив на мобилен за сите, а на десктоп само за KITCHEN */}
      <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-5 backdrop-blur-xl lg:hidden'>
        <p className='font-display tracking-[0.18em] text-primary'>LUMIÈRE</p>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Отвори оперативно мени'
            >
              <Menu className='size-5' />
            </Button>
          </SheetTrigger>

          <SheetContent
            side='left'
            className='flex w-72 flex-col border-outline-variant/20 bg-surface-container p-5 text-on-surface'
          >
            <div className='mb-10 flex items-center justify-between px-3'>
              <p className='font-display text-2xl tracking-[0.18em] text-primary'>
                LUMIÈRE
              </p>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setOpen(false)}
                aria-label='Затвори мени'
              >
                <X className='size-5' />
              </Button>
            </div>
            {navigation}
            {account}
          </SheetContent>
        </Sheet>
      </header>

      {/* Главна содржина */}
      <main className='min-w-0 lg:col-start-2'>{children}</main>
    </div>
  )
}
