'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCircle2, Clock, ShoppingBag, Truck } from 'lucide-react'
import { Role } from '@/lib/generated/prisma'
import { StaffColumn } from './StaffColumn'
import { KdsOrder } from '../Kitchen/KdsOrderCard'
import { useAudio } from '@/hooks/use-audio'
import { StaffHeader } from './StaffHeader'
import { useStaffOrders } from '@/hooks/use-staff-orders'

interface StaffBoardViewProps {
  initialOrders: KdsOrder[]
  role: Role
}

export function StaffBoardView({ initialOrders, role }: StaffBoardViewProps) {
  const { soundEnabled, toggleSound, playSound } = useAudio(
    '/sounds/kds-alarm.mp3',
  )
  const {
    orders,
    filteredOrders,
    searchQuery,
    setSearchQuery,
    pendingOrders,
    pickupReadyOrders,
    deliveryReadyOrders,
    inTransitOrders,
  } = useStaffOrders(initialOrders, playSound)

  // Тракирање за доцнење (delayed orders)
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000)
    return () => clearInterval(interval)
  }, [])

  const delayedCount = orders.filter((o) => {
    const createdAtMs = new Date(o.createdAt).getTime()
    return (now - createdAtMs) / 1000 / 60 > 25
  }).length

  return (
    <div className='relative flex min-h-screen flex-col bg-background text-foreground'>
      <StaffHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        totalOrders={orders.length}
        delayedCount={delayedCount}
      />

      {/* Main Board - 4 Колони */}
      <div className='relative z-10 flex flex-1 gap-6 overflow-x-auto px-8 pb-8'>
        <StaffColumn
          title='НОВИ НАРАЧКИ'
          count={pendingOrders.length}
          iconIndicator={
            <Clock className='size-4 text-amber-500 animate-pulse' />
          }
          orders={pendingOrders}
          role={role}
        />

        <div className='w-px bg-linear-to-b from-outline-variant/5 via-outline-variant/30 to-outline-variant/5' />

        <StaffColumn
          title='ЗА ПОДИГНУВАЊЕ (TAKEAWAY)'
          count={pickupReadyOrders.length}
          iconIndicator={
            <ShoppingBag className='size-4 text-primary animate-pulse' />
          }
          orders={pickupReadyOrders}
          role={role}
        />

        <div className='w-px bg-linear-to-b from-outline-variant/5 via-outline-variant/30 to-outline-variant/5' />

        <StaffColumn
          title='СПРЕМНИ ЗА ДОСТАВА'
          count={deliveryReadyOrders.length}
          iconIndicator={
            <CheckCircle2 className='size-4 text-emerald-500 animate-pulse' />
          }
          orders={deliveryReadyOrders}
          role={role}
        />

        <div className='w-px bg-linear-to-b from-outline-variant/5 via-outline-variant/30 to-outline-variant/5' />

        <StaffColumn
          title='ВО ТРАНЗИТ'
          count={inTransitOrders.length}
          iconIndicator={
            <Truck className='size-4 text-sky-500 animate-bounce' />
          }
          orders={inTransitOrders}
          role={role}
        />

        {filteredOrders.length === 0 && (
          <div className='col-span-full flex w-full flex-col items-center justify-center py-24 text-center text-muted-foreground'>
            <Bell className='mb-4 size-12 text-primary' />
            <p className='text-lg'>
              {searchQuery
                ? `Нема пронајдено нарачки за "${searchQuery}"`
                : 'Нема активни нарачки на таблата.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
