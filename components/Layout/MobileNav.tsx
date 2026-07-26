'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Calendar, UserIcon, Users, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { signOut, type SessionUser } from '@/lib/auth-client'
import { Role } from '@/lib/generated/prisma'

import {
  NAV_LINKS,
  MANAGEMENT_LINKS,
  KITCHEN_LINKS,
  STAFF_LINKS,
  USER_LINKS,
} from '@/lib/constants/nav-constants'
import { getUserInitials } from '@/lib/utils'
import { ROLE_LABELS } from '@/lib/constants/user-roles'

type MobileNavProps = {
  session: { user: SessionUser } | null | undefined
  isPending: boolean
  pathname: string
  openReservation: () => void
}

export function MobileNav({
  session,
  isPending,
  pathname,
  openReservation,
}: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const user = session?.user
  const userRole: Role = (user?.role as Role) || Role.USER
  const isManagement = userRole === 'ADMIN' || userRole === 'MANAGER'
  const initials = getUserInitials(user?.name)

  const closeDrawer = () => setOpen(false)

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Успешно се одјавивте.', {
              description: 'Се гледаме наскоро во Lumière!',
            })
            closeDrawer()
            router.refresh()
          },
          onError: () => {
            toast.error('Не успеавме да ве одјавиме.')
          },
        },
      })
    } catch (err) {
      toast.error('Се случи грешка при одјавување.')
      console.error('Sign out error:', err)
    }
  }

  const renderRoleLinks = (links: typeof USER_LINKS) =>
    links.map(({ href, label, Icon }) => (
      <Link
        key={href}
        href={href}
        onClick={closeDrawer}
        className='flex items-center gap-2.5 px-2 py-1.5 text-xs uppercase tracking-wider hover:text-primary transition-colors'
      >
        <Icon className='h-4 w-4 text-gold-accent' />
        {label}
      </Link>
    ))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className='text-surface-variant hover:text-primary transition-colors xl:hidden'
          aria-label='Отвори мени'
        >
          <Menu size={26} />
        </button>
      </SheetTrigger>

      <SheetContent
        side='left'
        className='w-75 sm:w-90 bg-surface/95 backdrop-blur-2xl border-r border-outline-variant/20 p-0 flex flex-col justify-between text-on-surface'
      >
        <div className='flex flex-col h-full overflow-y-auto p-6 space-y-6'>
          {/* Header */}
          <SheetHeader className='text-left pb-4 border-b border-outline-variant/15'>
            <SheetTitle className='font-display text-2xl font-bold text-primary tracking-widest uppercase'>
              LUMIÈRE
            </SheetTitle>
          </SheetHeader>

          {/* User Profile */}
          <div className='border-b border-outline-variant/15 pb-4'>
            {isPending ? (
              <div className='flex items-center gap-3'>
                <Skeleton className='w-10 h-10 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='w-24 h-3' />
                  <Skeleton className='w-32 h-3' />
                </div>
              </div>
            ) : user ? (
              <div className='flex flex-col space-y-3'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    {user.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user.name}
                        className='object-cover'
                      />
                    )}
                    <AvatarFallback className='bg-surface-container-high text-gold-accent font-serif text-sm font-bold uppercase'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col overflow-hidden'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold truncate'>
                        {user.name}
                      </span>
                      <span className='text-[8px] font-label-caps uppercase tracking-widest px-1.5 py-0.5 bg-gold-accent/10 text-primary border border-gold-accent/20'>
                        {ROLE_LABELS[userRole]}
                      </span>
                    </div>
                    <span className='text-xs text-on-surface-variant/70 truncate font-mono'>
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Role Links */}
                <div className='flex flex-col space-y-1 pt-2'>
                  {isManagement && (
                    <>
                      {renderRoleLinks(MANAGEMENT_LINKS)}
                      {userRole === 'ADMIN' && (
                        <Link
                          href='/admin/users'
                          onClick={closeDrawer}
                          className='flex items-center gap-2.5 px-2 py-1.5 text-xs uppercase tracking-wider hover:text-primary transition-colors'
                        >
                          <Users className='h-4 w-4 text-gold-accent' />
                          Корисници
                        </Link>
                      )}
                    </>
                  )}

                  {userRole === 'KITCHEN' && renderRoleLinks(KITCHEN_LINKS)}
                  {userRole === 'STAFF' && renderRoleLinks(STAFF_LINKS)}
                  {userRole === 'USER' && renderRoleLinks(USER_LINKS)}

                  <button
                    onClick={handleSignOut}
                    className='flex items-center gap-2.5 px-2 py-1.5 text-xs uppercase tracking-wider text-destructive hover:bg-destructive/10 transition-colors w-full text-left mt-2'
                  >
                    <LogOut className='h-4 w-4' />
                    Одјави се
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href={`/login?redirect_url=${pathname}`}
                onClick={closeDrawer}
                className='flex items-center gap-2.5 text-sm font-sans uppercase tracking-wider hover:text-primary transition-colors py-1'
              >
                <UserIcon size={20} />
                <span>Најави се</span>
              </Link>
            )}
          </div>

          {/* Navigation */}
          <div className='flex flex-col space-y-4 grow'>
            <span className='text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-bold'>
              Навигација
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeDrawer}
                className='font-sans text-sm uppercase tracking-wider hover:text-primary transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action */}
          <div className='pt-4 border-t border-outline-variant/15'>
            <button
              onClick={() => {
                closeDrawer()
                openReservation()
              }}
              className='w-full bg-primary text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold py-3 flex items-center justify-center gap-2 active:scale-95 transition-all'
            >
              <Calendar size={16} />
              Резервација
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
