'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KdsStatsBento } from './KdsStatsBento'

interface KdsHeaderProps {
  title: string
  subtitle: string
  totalOrders: number
  delayedOrdersCount: number
  soundEnabled: boolean
  onToggleSound: () => void
}

export function KdsHeader({
  title,
  subtitle,
  totalOrders,
  delayedOrdersCount,
  soundEnabled,
  onToggleSound,
}: KdsHeaderProps) {
  return (
    <div className='relative z-10 flex items-center justify-between px-8 py-6'>
      <div className='flex flex-col gap-1'>
        <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
          {subtitle}
        </span>
        <h1 className='font-heading text-3xl font-black uppercase text-primary'>
          {title}
        </h1>
      </div>

      <div className='flex items-center gap-4'>
        <Button
          variant={soundEnabled ? 'outline' : 'default'}
          size='sm'
          onClick={onToggleSound}
          className='gap-2 shadow-sm cursor-pointer'
        >
          {soundEnabled ? (
            <>
              <Volume2 className='size-4 text-emerald-500' />
              <span className='text-xs font-semibold'>SOUND IS ON</span>
            </>
          ) : (
            <>
              <VolumeX className='size-4' />
              <span className='text-xs font-semibold'>TURN ON THE SOUND</span>
            </>
          )}
        </Button>

        <KdsStatsBento
          totalOrders={totalOrders}
          avgTimeMinutes={12}
          delayedOrders={delayedOrdersCount}
        />
      </div>
    </div>
  )
}
