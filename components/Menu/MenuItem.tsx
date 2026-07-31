import { MenuItemWithRelations } from '@/types/default'
import { Check, Eye, ShoppingBag } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface MenuItemProps {
  item: MenuItemWithRelations
  isLcpCandidate: boolean
  isItemAdded: boolean
  onOpenDetails: (item: MenuItemWithRelations) => void
  handleAddToCart: (item: MenuItemWithRelations) => void
}

const MenuItemCard = ({
  item,
  isLcpCandidate,
  isItemAdded,
  onOpenDetails,
  handleAddToCart,
}: MenuItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className='group flex flex-col h-full overflow-hidden bg-surface border border-outline-variant/20 shadow-sm'
    >
      {/* Media Card */}
      <div
        className='relative aspect-square overflow-hidden bg-surface-container-high cursor-pointer'
        onClick={() => onOpenDetails(item)}
      >
        {/* Badges */}
        {item.isPopular && (
          <div className='absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-md shadow-md'>
            ПОПУЛАРНО
          </div>
        )}
        {item.isExclusive && (
          <div className='absolute top-3 right-3 z-10 bg-[#7a2222] text-[#fbebeb] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-md shadow-md'>
            ЕКСКЛУЗИВНО
          </div>
        )}

        <Image
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          src={item.image}
          alt={item.name}
          loading={isLcpCandidate ? 'eager' : 'lazy'}
          fetchPriority={isLcpCandidate ? 'high' : 'auto'}
          fill
          sizes='(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw'
        />

        {/* Hover Action Overlay za Desktop */}
        <div className='hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-3'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetails(item)
            }}
            className='flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider bg-surface/90 border border-outline px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-md'
          >
            <Eye size={14} />
            Детали
          </button>
        </div>
      </div>

      {/* Title, Description & Actions */}
      <div className='flex flex-col flex-1 justify-between p-3.5'>
        <div>
          <h3
            onClick={() => onOpenDetails(item)}
            className='min-h-6 md:min-h-12 font-display text-base font-semibold tracking-wide line-clamp-1 md:line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors'
          >
            {item.name}
          </h3>

          {/* Опис: Скриен на мобилен, видлив на desktop (со поправен `hidden md:block`) */}
          <p className='font-sans text-xs text-on-surface-variant/80 leading-relaxed line-clamp-2 mt-2'>
            {item.description}
          </p>
        </div>

        {/* Цена и Копчиња за Мобилен + Desktop */}
        <div className='flex items-center justify-between gap-2 pt-3 mt-3 border-t border-outline-variant/15'>
          <span className='font-sans text-sm md:text-base font-bold text-primary shrink-0'>
            {item.price.toLocaleString()}{' '}
            <span className='text-xs font-normal'>МКД</span>
          </span>

          <div className='flex items-center gap-3'>
            {/* Око за детали (мобилен) */}
            <button
              onClick={() => onOpenDetails(item)}
              aria-label='Детали'
              className='md:hidden p-2 text-on-surface-variant hover:text-primary bg-surface-container-high rounded-none transition-colors'
            >
              <Eye size={16} />
            </button>

            {/* Копче за нарачка (активно и удобно за мобилен) */}
            <button
              onClick={() => handleAddToCart(item)}
              className={`flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-none transition-all duration-200 active:scale-95 ${
                isItemAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-transpaent text-foreground border border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
                // : 'bg-primary text-primary-foreground hover:bg-primary-container'
              }`}
            >
              {isItemAdded ? (
                <>
                  <Check size={14} />
                  <span>Додадено</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Нарачај</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MenuItemCard
