'use client'

import { useState, useEffect } from 'react'
import { ChefHat, Flame } from 'lucide-react'
import { Role } from '@/lib/generated/prisma'
import { KdsColumn } from './KdsColumn'
import { KdsHeader } from './KdsHeader'
import { KdsOrder } from './KdsOrderCard'
import { useAudio } from '@/hooks/use-audio'
import { useKdsOrders } from '@/hooks/use-kds-orders'

interface KdsBoardViewProps {
  initialOrders: KdsOrder[]
  role: Role
}

export function KdsBoardView({ initialOrders, role }: KdsBoardViewProps) {
  const { soundEnabled, toggleSound, playSound } = useAudio()
  const { orders, confirmedOrders, preparingOrders } = useKdsOrders(
    initialOrders,
    playSound,
  )

  // Тракирање за доцнење (delayed orders)
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000)
    return () => clearInterval(interval)
  }, [])

  const delayedCount = orders.filter((o) => {
    const createdAtMs = new Date(o.createdAt).getTime()
    return (now - createdAtMs) / 1000 / 60 > 20
  }).length

  return (
    <div className='relative flex min-h-screen flex-col bg-background text-foreground'>
      <KdsHeader
        subtitle='СТАТУС НА КУЈНА'
        title='АКТИВНИ НАРАЧКИ ЗА ГОТВЕЊЕ'
        totalOrders={orders.length}
        delayedOrdersCount={delayedCount}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <div className='relative z-10 flex flex-1 gap-6 overflow-x-auto px-8 pb-8'>
        <KdsColumn
          title='НАРАЧКИ ЗА ГОТВЕЊЕ'
          count={confirmedOrders.length}
          iconIndicator={
            <div className='size-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]' />
          }
          orders={confirmedOrders}
          role={role}
        />

        <div className='w-px bg-linear-to-b from-outline-variant/5 via-outline-variant/30 to-outline-variant/5' />

        <KdsColumn
          title='ВО ПОДГОТОВКА'
          count={preparingOrders.length}
          iconIndicator={
            <Flame className='size-4 animate-bounce text-primary' />
          }
          orders={preparingOrders}
          role={role}
        />

        {orders.length === 0 && (
          <div className='col-span-full flex w-full flex-col items-center justify-center py-24 text-center text-muted-foreground'>
            <ChefHat className='mb-4 size-12 text-primary' />
            <p className='text-lg'>Нема активни нарачки во кујна.</p>
          </div>
        )}
      </div>
    </div>
  )
}
