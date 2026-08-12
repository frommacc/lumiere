'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Role } from '@/lib/generated/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PendingReservationsTable } from './PendingReservationsTable'
import { ActiveReservationsSection } from './ActiveReservationsSection'
import { DatePickerFilter } from './DatePickerFilter'
import { AdminReservation } from './ReservationsTable'

interface ReservationsTabsProps {
  pendingReservations: AdminReservation[]
  agendaReservations: AdminReservation[]
  role: Role
  currentDate: string
}

export function ReservationsTabs({
  pendingReservations,
  agendaReservations,
  role,
  currentDate,
}: ReservationsTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTab = searchParams.get('tab') || 'pending'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className='w-full space-y-6'
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/15 pb-4'>
        <TabsList className='bg-surface-container-high p-1'>
          <TabsTrigger value='pending' className='relative gap-2 px-4'>
            <span>New requirements</span>
            {pendingReservations.length > 0 && (
              <span className='rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400'>
                {pendingReservations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='agenda' className='px-4'>            Daily agenda
          </TabsTrigger>
        </TabsList>        {/* We show the DatePicker only when the "Daily Agenda" tab is active */}
        {currentTab === 'agenda' && (
          <div className='flex items-center gap-2'>
            <DatePickerFilter initialDate={currentDate} />
          </div>
        )}
      </div>      {/* TAB 1: All PENDING from base */}
      <TabsContent
        value='pending'
        className='space-y-4 focus-visible:outline-none'
      >
        <PendingReservationsTable
          reservations={pendingReservations}
          role={role}
        />
      </TabsContent>      {/* TAB 2: Daily agenda with the selected date */}
      <TabsContent
        value='agenda'
        className='space-y-4 focus-visible:outline-none'
      >
        <ActiveReservationsSection
          reservations={agendaReservations}
          role={role}
        />
      </TabsContent>
    </Tabs>
  )
}
