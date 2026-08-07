'use client'

import { Search, Volume2, VolumeX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KdsStatsBento } from '../Kitchen/KdsStatsBento'

interface StaffHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  soundEnabled: boolean
  onToggleSound: () => void
  totalOrders: number
  delayedCount: number
}

export function StaffHeader({
  searchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
  totalOrders,
  delayedCount,
}: StaffHeaderProps) {
  return (
    <div className='relative z-10 flex flex-wrap items-center justify-between gap-4 px-8 py-6'>
      <div className='flex flex-col gap-1'>
        <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
          СЕРВИС И ИСПРАРАКА
        </span>
        <h1 className='font-heading text-3xl font-black uppercase text-primary'>
          ТАБЛА ЗА ПРЕДАВАЊЕ
        </h1>
      </div>

      {/* Локално Пребарување Input */}
      <div className='relative w-full max-w-sm'>
        <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Пребарај по име, тел, #ID или адреса...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-9 pr-9 bg-card'
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer'
          >
            <X className='size-4' />
          </button>
        )}
      </div>

      <div className='hidden md:flex items-center gap-4'>
        <Button
          variant={soundEnabled ? 'outline' : 'default'}
          size='sm'
          onClick={onToggleSound}
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

        <KdsStatsBento
          totalOrders={totalOrders}
          avgTimeMinutes={18}
          delayedOrders={delayedCount}
        />
      </div>
    </div>
  )
}
