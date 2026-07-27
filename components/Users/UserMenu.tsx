'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'

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
import { signOut, type SessionUser } from '@/lib/auth-client'
import { Role } from '@/lib/generated/prisma'

import {
  MANAGEMENT_LINKS,
  KITCHEN_LINKS,
  STAFF_LINKS,
  USER_LINKS,
} from '@/lib/constants/nav-constants'
import { getUserInitials } from '@/lib/utils'
import { ROLE_LABELS } from '@/lib/constants/user-roles'
import { useEditProfileStore } from '@/store/useEditProfileStore'

type UserMenuProps = {
  user: SessionUser
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const openEditProfile = useEditProfileStore((state) => state.open)
  const userRole: Role = (user.role as Role) || Role.USER

  const isManagement = userRole === 'ADMIN' || userRole === 'MANAGER'
  const initials = getUserInitials(user.name)

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
            toast.error('Не успеавме да ве одјавиме.')
          },
        },
      })
    } catch (err) {
      toast.error('Се случи грешка при одјавување.')
      console.error('Sign out error:', err)
    }
  }

  const renderNavItems = (items: typeof USER_LINKS) =>
    items.map(({ href, label, Icon }) => (
      <DropdownMenuItem key={href} asChild>
        <Link
          href={href}
          className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
        >
          <Icon className='h-4 w-4 text-gold-accent' />
          <span>{label}</span>
        </Link>
      </DropdownMenuItem>
    ))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-8 w-8 cursor-pointer transition-transform hover:scale-105'>
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
          {/* Management */}
          {isManagement && (
            <>
              {renderNavItems(MANAGEMENT_LINKS)}
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

          {/* Kitchen */}
          {userRole === 'KITCHEN' && (
            <>
              {renderNavItems(KITCHEN_LINKS)}
              <DropdownMenuSeparator className='bg-outline/15 my-1' />
            </>
          )}

          {/* Staff */}
          {userRole === 'STAFF' && (
            <>
              {renderNavItems(STAFF_LINKS)}
              <DropdownMenuSeparator className='bg-outline/15 my-1' />
            </>
          )}

          {/* Guest User */}
          {userRole === 'USER' && (
            <>
              {renderNavItems(USER_LINKS)}
              <DropdownMenuSeparator className='bg-outline/15 my-1' />
            </>
          )}

          {/* General Option */}
          <DropdownMenuItem
            onSelect={openEditProfile}
            className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-on-surface hover:text-gold-accent focus:bg-gold-accent/10 focus:text-gold-accent rounded-none cursor-pointer transition-colors'
          >
            <Settings className='h-4 w-4' />
            <span>Уреди Профил</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className='bg-outline/15 my-1' />

        <DropdownMenuItem
          onClick={handleSignOut}
          className='flex w-full items-center gap-2.5 px-3 py-2 text-xs font-label-caps uppercase tracking-wider text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-none cursor-pointer transition-colors'
        >
          <LogOut className='h-4 w-4' />
          <span>Одјави се</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
