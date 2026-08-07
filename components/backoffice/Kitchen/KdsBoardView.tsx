'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { ChefHat, Flame, Volume2, VolumeX } from 'lucide-react'
import { OrderStatus, Role } from '@/lib/generated/prisma'
import { pusherClient } from '@/lib/pusher'
import { KdsColumn } from './KdsColumn'
import { KdsStatsBento } from './KdsStatsBento'
import { KdsOrder } from './KdsOrderCard'
import { Button } from '@/components/ui/button'

interface KdsBoardViewProps {
  initialOrders: KdsOrder[]
  role: Role
}

export function KdsBoardView({ initialOrders, role }: KdsBoardViewProps) {
  const [orders, setOrders] = useState<KdsOrder[]>(initialOrders)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. State за тековно време
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // 2. Пуштање еднократен звук при пристигнување нова нарачка
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return

    // Ја ресетираме позицијата на 0 за да свири одново дури и ако претходниот звук уште трае
    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('Audio play failed:', err)
    })
  }, [soundEnabled])

  // 3. Чисчење на аудиото при unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  // 4. Toggle звук со иницијализација и отклучување (без loop)
  const toggleSound = async () => {
    if (!soundEnabled) {
      if (!audioRef.current) {
        const audio = new Audio('/sounds/kds-alarm.mp3')
        audio.loop = false // 👈 ЕДНОКРАТЕН ЗВУК (без повторување)
        audioRef.current = audio
      }

      try {
        // Тестно пуштање за отклучување на Browser Autoplay
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0

        setSoundEnabled(true)
      } catch (error) {
        console.error('Грешка со аудиото:', error)
        setSoundEnabled(true)
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setSoundEnabled(false)
    }
  }

  // 5. Pusher претплата
  useEffect(() => {
    const channel = pusherClient.subscribe('kds-channel')

    channel.bind('new-order-created', (newOrder: KdsOrder) => {
      const formattedOrder: KdsOrder = {
        ...newOrder,
        createdAt: new Date(newOrder.createdAt),
        items: newOrder.items ?? [],
      }

      setOrders((prev) => [formattedOrder, ...prev])

      // 👈 Пушти звук САМО ЕДНАШ кога стигнува новата нарачка
      playNotificationSound()
    })

    channel.bind(
      'order-status-updated',
      (data: { orderId: string; status: OrderStatus }) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === data.orderId
              ? { ...order, status: data.status }
              : order,
          ),
        )
      },
    )

    return () => {
      pusherClient.unsubscribe('kds-channel')
    }
  }, [playNotificationSound])

  // Филтрирање
  const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING)
  const confirmedOrders = orders.filter(
    (o) => o.status === OrderStatus.CONFIRMED,
  )
  const preparingOrders = orders.filter(
    (o) => o.status === OrderStatus.PREPARING,
  )

  const delayedCount = orders.filter((o) => {
    const createdAtMs = new Date(o.createdAt).getTime()
    return (now - createdAtMs) / 1000 / 60 > 20
  }).length

  return (
    <div className='relative flex min-h-screen flex-col bg-background text-foreground'>
      {/* Top Header & Controls */}
      <div className='relative z-10 flex items-center justify-between px-8 py-6'>
        <div className='flex flex-col gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
            СТАТУС НА КУЈНА
          </span>
          <h1 className='font-heading text-3xl font-black uppercase text-primary'>
            АКТИВНИ НАРАЧКИ
          </h1>
        </div>

        <div className='flex items-center gap-4'>
          {/* Копче за звук */}
          <Button
            variant={soundEnabled ? 'outline' : 'default'}
            size='sm'
            onClick={toggleSound}
            className='gap-2 shadow-sm cursor-pointer'
          >
            {soundEnabled ? (
              <>
                <Volume2 className='size-4 text-emerald-500' />
                <span className='text-xs font-semibold'>ЗВУКОТ Е АКТИВЕН</span>
              </>
            ) : (
              <>
                <VolumeX className='size-4' />
                <span className='text-xs font-semibold'>ВКЛУЧИ ЗВУК</span>
              </>
            )}
          </Button>

          {/* Статистика Bento */}
          <KdsStatsBento
            totalOrders={orders.length}
            avgTimeMinutes={12}
            delayedOrders={delayedCount}
          />
        </div>
      </div>

      {/* Main KDS Board (Horizontal Scroll Kanban) */}
      <div className='relative z-10 flex flex-1 gap-6 overflow-x-auto px-8 pb-8'>
        <KdsColumn
          title='НОВИ НАРАЧКИ'
          count={pendingOrders.length}
          iconIndicator={<div className='size-3 rounded-full bg-foreground' />}
          orders={pendingOrders}
          role={role}
        />

        <div className='w-px bg-linear-to-b from-outline-variant/5 via-outline-variant/30 to-outline-variant/5' />

        <KdsColumn
          title='ПОТВРДЕНИ'
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
