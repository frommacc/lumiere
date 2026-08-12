'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { MenuItemWithRelations } from '@/types/menu-item'
import {
  AlertCircle,
  ChefHat,
  Flame,
  Globe,
  MapPin,
  Sparkles,
  Utensils,
  Wine,
  X,
} from 'lucide-react'
import Image from 'next/image'

interface MenuItemDetailsProps {
  item: MenuItemWithRelations | null
  isOpen: boolean
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  appetizer: 'Appetizer',
  main: 'Main Course',
  dessert: 'Dessert',
  wine: 'Exclusive Wine',
  Appetizers: 'Appetizer',
  'Main Courses': 'Main Course',
  Desserts: 'Dessert',
  'Exclusive Wines': 'Exclusive Wine',
}

export default function MenuItemDetails({
  item,
  isOpen,
  onClose,
}: MenuItemDetailsProps) {
  if (!item) return null

  const categoryName = item.category?.name || 'General'
  const categoryDisplayName = categoryLabels[categoryName] || categoryName

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>      {/* 1. Added: flex flex-col */}
      <DialogContent className='p-0 border border-outline-variant bg-background text-foreground max-w-[90%] md:max-w-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] [&>button]:hidden max-h-[90vh] rounded-2xl backdrop-blur-2xl flex flex-col'>        {/* Banner Image & Overlay */}
        {/* 2. Added: shrink-0 */}
        <div className='relative h-64 w-full bg-card shrink-0'>
          <Image
            src={item.image}
            alt={item.name}
            className='object-cover filter brightness-[0.9] contrast-[1.05]'
            fill
            sizes='(max-width: 768px) 100vw, 500px'
            priority
          />

          {/* Vignette Gradient Background */}
          <div className='absolute inset-0 bg-linear-to-t from-background via-background/40 to-black/30' />

          {/* Badges */}
          <div className='absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none'>
            {item.isPopular && (
              <span className='bg-background/80 backdrop-blur-md border border-primary/30 text-primary font-mono text-[10px] tracking-[0.2em] font-medium px-3 py-1 uppercase rounded-full flex items-center gap-1.5 shadow-lg'>
                <Flame size={12} className='text-primary' /> POPULAR
              </span>
            )}
            {item.isExclusive && (
              <span className='bg-linear-to-r from-muted/90 to-card/90 backdrop-blur-md border border-primary/40 text-primary-fixed font-mono text-[10px] tracking-[0.2em] font-medium px-3 py-1 uppercase rounded-full flex items-center gap-1.5 shadow-lg'>
                <Sparkles size={12} className='text-primary' /> EXCLUSIVE
              </span>
            )}
          </div>

          {/* Custom Close Button */}
          <DialogClose className='absolute top-4 right-4 bg-background/60 border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all p-2 rounded-full outline-none backdrop-blur-md z-20 group'>
            <span className='sr-only'>Close</span>
            <X
              size={16}
              className='group-hover:rotate-90 transition-transform duration-300'
            />
          </DialogClose>
        </div>        {/* Content Section */}
        {/* 3. Added: flex-1 min-h-0 */}
        <div className='p-6 space-y-6 -mt-6 relative z-10 overflow-y-auto no-scrollbar flex-1 min-h-0'>
          {/* Header & Category */}
          <div>
            <div className='flex items-center justify-between gap-4 mb-4'>
              <span className='font-mono text-[11px] uppercase tracking-[0.25em] text-primary/90 font-medium'>
                {categoryDisplayName}
              </span>
              {item.origin && (
                <div className='flex items-center gap-1 text-muted-foreground font-sans text-xs tracking-wider'>
                  <MapPin size={13} className='text-primary' />
                  <span>{item.origin}</span>
                </div>
              )}
            </div>

            <div className='flex items-baseline justify-between gap-4 mt-1'>
              <DialogTitle className='font-mono text-2xl md:text-3xl font-medium text-foreground tracking-wide'>
                {item.name}
              </DialogTitle>
              <span className='font-mono text-xl font-semibold text-primary shrink-0 tracking-wider'>
                {item.price.toLocaleString()}{' '}
                <span className='text-xs text-primary/80 uppercase font-sans'>                  $
                </span>
              </span>
            </div>
          </div>

          {/* Main Description */}
          <p className='font-sans text-sm text-foreground/80 font-light leading-relaxed'>
            {item.description}
          </p>

          {/* Dietary Tags */}
          {item.dietary && item.dietary.length > 0 && (
            <div className='flex flex-wrap gap-1.5 pt-1'>
              {item.dietary.map((tag, idx) => (
                <span
                  key={idx}
                  className='text-[10px] font-mono uppercase tracking-wider bg-surface-container border border-outline-variant/50 text-primary-fixed px-2.5 py-0.5 rounded-md'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className='border-t border-border/60 my-4' />

          {/* Details Grid: Preparation & Ingredients */}
          <div className='space-y-4 text-xs font-sans'>            {/* Preparation */}
            { item.preparation && (
              <div className='bg-surface-container/60 border border-outline-variant/40 p-3.5 rounded-xl flex items-start gap-3'>
                <ChefHat className='text-primary shrink-0 mt-0.5' size={18} />
                <div>
                  <h4 className='font-mono uppercase tracking-wider text-foreground font-medium text-[11px] mb-0.5'>                    Preparation & Culinary Technique
                  </h4>
                  <p className='text-muted-foreground font-light leading-relaxed'>
                    {item.preparation}
                  </p>
                </div>
              </div>
            )}

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className='flex items-start gap-3 px-1'>
                <Utensils
                  className='text-primary/80 shrink-0 mt-0.5'
                  size={16}
                />
                <div>
                  <h4 className='font-mono uppercase tracking-wider text-foreground/90 font-medium text-[11px] mb-1'>                    Composition & Ingredients
                  </h4>
                  <p className='text-muted-foreground font-light leading-relaxed'>
                    {item.ingredients.join(' • ')}
                  </p>
                </div>
              </div>
            )}

            {/* Wine / Beverage Pairing */}
            {item.pairing && (
              <div className='flex items-start gap-3 px-1'>
                <Wine className='text-primary shrink-0 mt-0.5' size={16} />
                <div>
                  <h4 className='font-mono uppercase tracking-wider text-primary font-medium text-[11px] mb-0.5'>                    Sommelier's Pairing Recommendation
                  </h4>
                  <p className='text-foreground/90 italic font-mono leading-relaxed'>
                    {item.pairing}
                  </p>
                </div>
              </div>
            )}

            {/* Allergens Notice */}
            {item.allergens && item.allergens.length > 0 && (
              <div className='flex items-center gap-2 pt-2 text-muted-foreground text-[11px]'>
                <AlertCircle size={14} className='text-primary/70 shrink-0' />
                <span>
                  <strong className='text-foreground/90 font-medium'>                    Allergens:
                  </strong>{' '}
                  {item.allergens.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Authenticity Guarantee Banner */}
          <div className='bg-linear-to-r from-surface-container via-card to-surface-container p-4 rounded-xl border border-outline-variant/30 flex gap-3.5 items-center mt-6'>
            <Globe className='text-primary shrink-0' size={20} />
            <p className='font-sans text-[11px] text-muted-foreground leading-relaxed font-light'>              In{' '}
              <span className='text-primary font-mono tracking-widest uppercase font-semibold'>
                Lumière
              </span>              , we guarantee 100% authenticity and top quality of all ingredients,
              carefully selected from their original regions.
            </p>
          </div>

          {/* Action Button */}
          <div className='pt-2 flex justify-end'>
            <DialogClose className='w-full sm:w-auto bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] font-semibold px-8 py-3 hover:brightness-110 active:scale-[0.98] transition-all outline-none text-center cursor-pointer'>              Close View
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
