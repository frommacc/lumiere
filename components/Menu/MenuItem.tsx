import { MenuItemWithRelations } from '@/types/default'
import { Check, Eye, Plus } from 'lucide-react'
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
      className='group flex flex-col'
    >
      {/* Media Card */}
      <div className='relative aspect-square overflow-hidden mb-4 bg-surface-container-high'>
        {/* Badges */}
        {item.isPopular && (
          <div className='absolute top-4 left-4 z-10 bg-primary text-primary-foreground font-sans text-[9px] font-bold tracking-widest px-3 py-1 uppercase rounded-sm'>
            ПОПУЛАРНО
          </div>
        )}
        {item.isExclusive && (
          <div className='absolute top-4 right-4 z-10 bg-[#7a2222] text-[#fbebeb] font-sans text-[9px] font-bold tracking-widest px-3 py-1 uppercase rounded-sm'>
            ЕКСКЛУЗИВНО
          </div>
        )}

        <Image
          className='object-cover transition-transform duration-700 group-hover:scale-105'
          src={item.image}
          alt={item.name}
          loading={isLcpCandidate ? 'eager' : 'lazy'}
          fetchPriority={isLcpCandidate ? 'high' : 'auto'}
          fill
          sizes='(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw'
        />

        {/* Hover Action Overlay */}
        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4'>
          <button
            onClick={() => onOpenDetails(item)}
            className='flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider bg-surface/90 border border-outline px-6 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300'
          >
            <Eye size={14} />
            Детали
          </button>

          <button
            onClick={() => handleAddToCart(item)}
            className='flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-6 py-2.5 hover:bg-primary-container active:scale-95 transition-all duration-300'
          >
            {isItemAdded ? (
              <>
                <Check size={14} />
                Додадено!
              </>
            ) : (
              <>
                <Plus size={14} />
                Нарачај
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title & Price Header */}
      <div>
        <div className='flex flex-col mb-3'>
          <h3 className='font-display text-base md:text-lg font-semibold tracking-wide line-clamp-1 md:line-clamp-2 min-h-6 md:min-h-12 leading-snug'>
            {item.name}
          </h3>

          {/* Цена: Секогаш порамнета под насловот */}
          <span className='font-sans text-sm font-semibold text-primary shrink-0 mt-2'>
            {item.price.toLocaleString()} МКД
          </span>
        </div>

        <p className='hidden md:blok font-sans text-sm text-on-surface-variant/90 leading-relaxed mb-4 line-clamp-2'>
          {item.description}
        </p>

        {/* Interactive mobile trigger to make actions clear on touch devices */}
        <div className='flex justify-between items-center sm:hidden pt-2 border-t border-outline-variant/10'>
          <button
            onClick={() => onOpenDetails(item)}
            className='text-sm font-semibold tracking-wider font-sans text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1'
          >
            <Eye size={12} /> Детали
          </button>
          <button
            onClick={() => handleAddToCart(item)}
            className='text-sm font-semibold tracking-wider font-sans text-primary hover:text-primary-container transition-colors flex items-center gap-1'
          >
            {isItemAdded ? <Check size={12} /> : <Plus size={12} />}
            {isItemAdded ? 'Додадено' : 'Нарачај'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MenuItemCard
