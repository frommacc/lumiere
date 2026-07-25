'use client'

import { MapPin, Globe, Award, Sparkles, Flame } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { MenuItemWithRelations } from '@/types/default'

interface IngredientModalProps {
  item: MenuItemWithRelations | null
  isOpen: boolean
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  appetizer: 'Предјадење',
  main: 'Главно Јадење',
  dessert: 'Десерт',
  wine: 'Ексклузивно Вино',
  // Исто така ги додаваме и доколку кај тебе во базата name е на македонски:
  Предјадења: 'Предјадење',
  'Главни Јадења': 'Главно Јадење',
  Десерти: 'Десерт',
  'Ексклузивни Вина': 'Ексклузивно Вино',
}

export default function IngredientModal({
  item,
  isOpen,
  onClose,
}: IngredientModalProps) {
  if (!item) return null

  const prov = item.provenance

  if (!prov) return null

  // Го земаме убаво форматираниот Лебел:
  // Прво проверуваме по името/slug-от на категоријата, а ако ја нема во речникот — го прикажуваме оригиналното име
  const categoryDisplayName =
    categoryLabels[item.category.name] || item.category.name

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='p-0 border border-outline-variant/30 bg-surface-container max-w-[90%] md:max-w-lg overflow-hidden shadow-2xl [&>button]:hidden max-h-[90vh] overflow-y-auto rounded-xl'>
        {/* Banner Image */}
        <div className='relative h-56 w-full'>
          <Image
            src={prov.image || item.image}
            alt={prov.title || item.name}
            className='object-cover'
            fill
          />

          {/* Fade Gradient */}
          <div className='absolute -bottom-0.5 h-30 w-full bg-linear-to-t from-surface-container via-surface-container/60 to-transparent' />

          {/* Badges */}
          <div className='absolute top-4 left-4 z-10 flex flex-wrap gap-2'>
            {item.isPopular && (
              <span className='bg-primary text-primary-foreground font-sans text-[9px] font-bold tracking-widest px-3 py-1 uppercase rounded-sm flex items-center gap-1 shadow-md'>
                <Flame size={11} /> ПОПУЛАРНО
              </span>
            )}
            {item.isExclusive && (
              <span className='bg-[#7a2222] text-[#fbebeb] font-sans text-[9px] font-bold tracking-widest px-3 py-1 uppercase rounded-sm flex items-center gap-1 shadow-md'>
                <Sparkles size={11} /> ЕКСКЛУЗИВНО
              </span>
            )}
          </div>

          <DialogClose className='absolute top-4 right-4 bg-black/40 text-on-surface hover:text-primary transition-colors p-1.5 rounded-full outline-none focus:ring-2 focus:ring-primary z-20'>
            <span className='sr-only'>Затвори</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </DialogClose>
        </div>

        {/* Content Detail */}
        <div className='p-6 space-y-4'>
          {/* Provenance Header Badge */}
          <div className='flex items-center gap-2 text-primary'>
            <Award size={16} />
            <span className='font-sans text-[10px] uppercase tracking-[0.2em] font-bold'>
              ПОТЕКЛО НА СОСТОЈКИТЕ
            </span>
          </div>

          {/* Title & Origin */}
          <div>
            <DialogTitle className='font-display text-2xl font-bold text-on-surface'>
              {item.name}
            </DialogTitle>

            {prov.title && prov.title !== item.name && (
              <p className='font-display text-base font-medium text-on-surface-variant/80 mt-0.5'>
                {prov.title}
              </p>
            )}

            {/* Origin label */}
            {prov.origin && (
              <div className='flex items-center gap-2 text-primary/95 mt-1.5 font-sans text-xs font-semibold uppercase tracking-wider'>
                <MapPin size={13} />
                <span>{prov.origin}</span>
              </div>
            )}
          </div>

          {/* Category & Price */}
          <div className='flex items-center justify-between pt-2 border-t border-outline-variant/15 text-xs'>
            <span className='font-sans text-primary/80 font-semibold uppercase tracking-wider'>
              {/* Решено: го користиме прилагоденото име од речникот */}
              {categoryDisplayName}
            </span>
            <span className='font-sans font-bold text-primary text-sm'>
              {item.price.toLocaleString()} МКД
            </span>
          </div>

          {/* Item & Provenance Descriptions */}
          <p className='font-sans text-sm text-on-surface-variant/90 leading-relaxed'>
            {item.description}
          </p>

          {prov.details && (
            <p className='font-sans text-xs text-on-surface-variant/80 leading-relaxed bg-surface-container/30 p-3 rounded border border-outline-variant/10'>
              {prov.details}
            </p>
          )}

          {/* Authenticity Guarantee Banner */}
          <div className='bg-surface-container-high/60 p-4 rounded border border-outline-variant/20 flex gap-3 items-center'>
            <Globe className='text-primary shrink-0' size={18} />
            <p className='font-sans text-[11px] text-on-surface-variant/90'>
              Во <span className='text-primary font-semibold'>LUMIÈRE</span>,
              гарантираме 100% следливост на сите ексклузивни компоненти,
              директно од нивниот оригинален регион до вашата чинија.
            </p>
          </div>

          {/* Action Button */}
          <div className='pt-2 flex justify-end'>
            <DialogClose className='bg-primary text-primary-foreground font-sans text-xs uppercase tracking-widest font-semibold px-6 py-2.5 hover:bg-primary-container active:scale-95 transition-all outline-none'>
              Затвори Приказ
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
