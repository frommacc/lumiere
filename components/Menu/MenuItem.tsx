import { MenuItemWithRelations } from '@/types/default'
import { Check, Eye, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface MenuItemProps {
  item: MenuItemWithRelations
  isItemAdded: boolean
  onOpenProvenance: (item: MenuItemWithRelations) => void
  handleAddToCart: (item: MenuItemWithRelations) => void
}

const MenuItemCard = ({
  item,
  isItemAdded,
  onOpenProvenance,
  handleAddToCart,
}: MenuItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className='group flex flex-col justify-between'
    >
      {/* Media Card */}
      <div className='relative aspect-4/5 overflow-hidden mb-6 bg-surface-container-high rounded-xl'>
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
          loading='lazy'
          fill
        />

        {/* Hover Action Overlay */}
        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4'>
          <button
            onClick={() => onOpenProvenance(item)}
            className='flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider bg-surface/90 border border-outline px-6 py-2.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300'
          >
            <Eye size={14} />
            Потекло &amp; Детали
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
        <div className='flex items-end justify-between mb-2'>
          <h3 className='font-display text-xl text-on-surface font-semibold tracking-wide'>
            {item.name}
          </h3>
          <div className='dot-leader hidden sm:block'></div>
          <span className='font-sans text-sm font-semibold text-primary shrink-0'>
            {item.price.toLocaleString()} МКД
          </span>
        </div>

        <p className='font-sans text-sm text-on-surface-variant/90 leading-relaxed mb-4'>
          {item.description}
        </p>

        {/* Interactive mobile trigger to make actions clear on touch devices */}
        <div className='flex justify-between items-center sm:hidden pt-2 border-t border-outline-variant/10'>
          <button
            onClick={() => onOpenProvenance(item)}
            className='text-xs font-semibold tracking-wider font-sans text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1'
          >
            <Eye size={12} /> Потекло
          </button>
          <button
            onClick={() => handleAddToCart(item)}
            className='text-xs font-semibold tracking-wider font-sans text-primary hover:text-primary-container transition-colors flex items-center gap-1'
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
