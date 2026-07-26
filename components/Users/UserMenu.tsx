'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  ChefHat,
  ClipboardList,
  UserCircle,
  Settings,
  LogOut,
  ShoppingBag,
  Star,
  Receipt,
  Users,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import type { SessionUser } from '@/lib/auth-client'
// import { EditProfileModal } from '../Profile/EditProfileModal'
import { toast } from 'sonner'
import { Role } from '@/lib/generated/prisma'

type UserMenuProps = {
  user: SessionUser
}

// Помошна функција за ознака на ролата на македонски
const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Администратор',
  MANAGER: 'Менаџер',
  KITCHEN: 'Кујна',
  STAFF: 'Персонал',
  USER: 'Гост',
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const userRole: Role = (user.role as Role) || Role.USER

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Успешно се одјавивте.', {
              description: 'Се гледаме наскоро во Lumière!',
            })
            router.refresh()
          },
          onError: () => {
            toast.error('Не успеавме да ве одјавиме.', {
              description: 'Ве молиме обидете се повторно.',
            })
          },
        },
      })
    } catch (err) {
      toast.error('Се случи грешка при одјавување.')
      console.error('Sign out error:', err)
    }
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'L'

  const isManagement = userRole === 'ADMIN' || userRole === 'MANAGER'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='h-8 w-8 ring-1 ring-gold-accent/30 cursor-pointer transition-transform hover:scale-105'>
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name}
                className='object-cover'
              />
            )}
            <AvatarFallback className='bg-surface-container-high text-gold-accent font-serif text-xs font-bold uppercase'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='w-64 bg-surface/95 backdrop-blur-2xl border-outline/20 p-2 shadow-2xl text-on-surface rounded-none'
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* Кориснички информации & Рола */}
          <DropdownMenuLabel className='px-3 py-2.5 font-normal'>
            <div className='flex flex-col space-y-1.5'>
              <div className='flex items-center justify-between gap-2'>
                <p className='text-xs font-semibold leading-none text-on-surface truncate'>
                  {user.name}
                </p>
                <span className='text-[9px] font-label-caps uppercase tracking-widest px-1.5 py-0.5 bg-gold-accent/10 text-primary border border-gold-accent/20 rounded-none'>
                  {ROLE_LABELS[userRole]}
                </span>
              </div>
              <p className='text-xs lowercase truncate text-on-surface-variant/70 font-mono'>
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className='bg-outline/15 my-1' />

          <DropdownMenuGroup className='space-y-0.5'>
            {/* --- ADMIN / MANAGER МЕНИ --- */}
            {isManagement && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href='/admin/dashboard'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <LayoutDashboard className='h-4 w-4 text-gold-accent' />
                    <span>Дашборд</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/admin/reservations'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <CalendarDays className='h-4 w-4 text-gold-accent' />
                    <span>Резервации</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/admin/orders'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <Receipt className='h-4 w-4 text-gold-accent' />
                    <span>Нарачки</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/admin/menu'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <UtensilsCrossed className='h-4 w-4 text-gold-accent' />
                    <span>Мени & Јадења</span>
                  </Link>
                </DropdownMenuItem>

                {userRole === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link
                      href='/admin/users'
                      className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                    >
                      <Users className='h-4 w-4 text-gold-accent' />
                      <span>Корисници</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className='bg-outline/15 my-1' />
              </>
            )}

            {/* --- KITCHEN МЕНИ --- */}
            {userRole === 'KITCHEN' && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href='/kitchen/orders'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <ChefHat className='h-4 w-4 text-gold-accent' />
                    <span>Кујнски Екран</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-outline/15 my-1' />
              </>
            )}

            {/* --- STAFF МЕНИ --- */}
            {userRole === 'STAFF' && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href='/staff/tables'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <ClipboardList className='h-4 w-4 text-gold-accent' />
                    <span>Активни Маси</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href='/staff/reservations'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <CalendarDays className='h-4 w-4 text-gold-accent' />
                    <span>Денешни Резервации</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-outline/15 my-1' />
              </>
            )}

            {/* --- GOST / USER МЕНИ --- */}
            {userRole === 'USER' && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href='/profile'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <UserCircle className='h-4 w-4' />
                    <span>Мој Профил</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/profile/reservations'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <CalendarDays className='h-4 w-4' />
                    <span>Мои Резервации</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/profile/orders'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <ShoppingBag className='h-4 w-4' />
                    <span>Мои Нарачки</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href='/profile/reviews'
                    className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
                  >
                    <Star className='h-4 w-4' />
                    <span>Мои Оцени</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className='bg-outline/15 my-1' />
              </>
            )}

            {/* Општи опции за сите роли */}
            <DropdownMenuItem
              onSelect={() => setIsProfileModalOpen(true)}
              className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
            >
              <Settings className='h-4 w-4' />
              <span>Уреди Профил</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className='bg-outline/15 my-1' />

          {/* Одјава */}
          <DropdownMenuItem
            onClick={handleSignOut}
            className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-none cursor-pointer transition-colors'
          >
            <LogOut className='h-4 w-4' />
            <span>Одјави се</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Модал за измена на профил */}
      {/* <EditProfileModal
        currentName={user.name}
        currentPhone={user.phone ?? null}
        currentImage={user.image ?? null}
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        showTrigger={false}
      /> */}
    </>
  )
}
