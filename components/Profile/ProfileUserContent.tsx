import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  CalendarDays,
  Mail,
  MessageSquareHeart,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/lib/utils'
import { getRoleLabel } from '@/lib/constants/user-roles'
import { getProfileUser } from '@/lib/db/users.services'
import { getLatestUserReservation } from '@/lib/db/reservations.services'
import { EditProfileButton } from './EditProfileButton'
import { ReviewButton } from '@/components/Reviews/ReviewButton'
import { ChangePasswordButton } from './ChangePasswordButton'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Skopje',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Europe/Skopje',
})

export async function ProfileUserContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login?redirect_url=/profile')
  }

  const [user, latestReservation] = await Promise.all([
    getProfileUser(session.user.id),
    getLatestUserReservation(session.user.id),
  ])

  if (!user) {
    redirect('/login?redirect_url=/profile')
  }

  return (
    <>
      <section className='relative isolate mb-12 w-full overflow-hidden border-y border-primary/10 bg-linear-to-br from-surface-container via-surface to-surface-container-high/80 px-6 py-16 md:mb-16 md:px-12'>
        <div className='absolute inset-0 pointer-events-none bg-linear-to-br from-primary/10 via-transparent to-tertiary/10' />
        <div className='absolute -left-1/4 top-0 h-full w-2/3 -skew-x-12 bg-linear-to-r from-primary/10 to-transparent blur-3xl pointer-events-none' />
        <div className='absolute inset-0 opacity-20 pointer-events-none'>
          <div className='absolute top-0 left-1/4 size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse' />
          <div className='absolute bottom-0 right-1/4 size-96 bg-tertiary/5 rounded-full blur-[120px]' />
        </div>
        <div className='absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface/90 to-transparent pointer-events-none' />

        <div className='relative z-10 flex flex-col items-center justify-center text-center'>
          <div className='relative mb-8 group'>
            <div className='absolute -inset-1 bg-linear-to-b from-primary/40 to-transparent rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500' />
            <Avatar className='relative size-40 md:size-56 border border-primary/20 p-1 bg-surface'>
              {user.image && (
                <AvatarImage src={user.image} alt={user.name} className='scale-105 group-hover:scale-100 transition-transform duration-700' />
              )}
              <AvatarFallback className='bg-surface-container-high text-primary font-display text-4xl md:text-6xl'>
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className='absolute bottom-4 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-xl font-label-caps text-[10px] tracking-widest uppercase'>
              {getRoleLabel(user.role, true)}
            </span>
          </div>

          <h1 className='font-display text-4xl md:text-6xl text-on-surface mb-2 tracking-tight'>
            {user.name}
          </h1>
          <div className='flex items-center gap-3'>
            <span className='h-px w-8 bg-primary/40' />
            <span className='font-label-caps text-xs text-primary tracking-[0.3em] uppercase'>              Lumière member
            </span>
            <span className='h-px w-8 bg-primary/40' />
          </div>

          <EditProfileButton />
        </div>
      </section>

      <section className='px-6 md:px-12 mb-24'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <div className='lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-low/40 backdrop-blur-md p-8 md:p-10 rounded-xl border border-outline-variant/10'>
            <ProfileField label='Name and surname' value={user.name} icon={UserRound} />
            <ProfileField label='Email' value={user.email} icon={Mail} />
            <ProfileField label='Telephone number' value={user.phone} icon={Phone} />
            <ProfileField label='Member of' value={dateFormatter.format(user.createdAt)} icon={CalendarDays} />
            <div className='md:col-span-2 flex flex-col gap-4 border-t border-outline-variant/15 pt-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <ShieldCheck className='size-4' />
                </div>
                <div>
                  <p className='text-sm font-medium text-on-surface'>Account security</p>
                  <p className='mt-0.5 text-xs leading-relaxed text-on-surface-variant'>                    Update your password to keep your account secure.
                  </p>
                </div>
              </div>
              <ChangePasswordButton compact />
            </div>
          </div>

          <aside className='lg:col-span-4 relative p-8 md:p-10 bg-linear-to-br from-surface-container-highest to-surface-container border border-primary/20 rounded-xl shadow-2xl overflow-hidden'>
            <div className='absolute -top-10 -right-10 size-40 bg-primary/10 rounded-full blur-3xl' />
            <div className='relative z-10'>
              <p className='font-label-caps text-[11px] text-primary tracking-[0.3em] uppercase mb-1'>                Lumière profile
              </p>
              <h2 className='font-display text-2xl text-on-surface'>                Last reservation
              </h2>
            </div>
            <div className='relative z-10 mt-10 border-t border-outline-variant/20 pt-6'>
              {latestReservation ? (
                <p className='text-sm text-on-surface leading-relaxed'>                  {latestReservation.table.tableType.name} · {dateFormatter.format(latestReservation.startTime)} in {timeFormatter.format(latestReservation.startTime)}
                </p>
              ) : (
                <p className='text-sm text-on-surface-variant'>                  You have not made a reservation yet.
                </p>
              )}

              <Link
                href='/profile/reservations'
                className='mt-6 inline-flex items-center justify-center border border-primary/50 px-4 py-2.5 font-label-caps text-[10px] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground'
              >                View all bookings
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className='px-6 pb-24 md:px-12'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/10 via-surface-container-low to-tertiary/10 px-7 py-7 sm:flex-row sm:items-center sm:justify-between md:px-10'>
          <div className='flex items-start gap-4'>
            <div className='flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface text-primary shadow-sm'>
              <MessageSquareHeart className='size-5' />
            </div>
            <div>
              <p className='font-label-caps text-[10px] uppercase tracking-[0.22em] text-primary'>Your experience</p>
              <h2 className='mt-1 font-display text-2xl text-on-surface'>Share your impression</h2>
              <p className='mt-1 max-w-2xl text-sm leading-relaxed text-on-surface-variant'>                After a successful order or completed reservation, your review helps us create an even better experience.
              </p>
            </div>
          </div>
          <ReviewButton />
        </div>
      </section>
    </>
  )
}

function ProfileField({ label, value, icon: Icon }: { label: string; value: string; icon: typeof UserRound }) {
  return (
    <div className='space-y-2 min-w-0'>
      <p className='font-label-caps text-[10px] text-outline tracking-widest uppercase'>{label}</p>
      <div className='flex items-center gap-3 min-w-0'>
        <Icon className='size-4 shrink-0 text-primary' />
        <p className='text-base text-on-surface truncate'>{value}</p>
      </div>
    </div>
  )
}
