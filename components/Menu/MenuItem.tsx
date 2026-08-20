import { MenuItemWithRelations } from '@/types/menu-item'
import { Check, Eye, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { Price } from '../shared/Price'

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
    <div className='group flex flex-col h-full overflow-hidden bg-surface-container/80 backdrop-blur-xl border-b border-primary/20'>
      {/* Media Card */}
      <div
        className='relative aspect-square overflow-hidden bg-surface-container-high cursor-pointer'
        onClick={() => onOpenDetails(item)}
      >
        {/* Badges */}
        {item.isPopular && (
          <div className='absolute top-3 left-3 z-10 bg-primary text-primary-foreground font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-md shadow-md'>
            {' '}
            POPULAR
          </div>
        )}
        {item.isExclusive && (
          <div className='absolute top-3 right-3 z-10 bg-[#7a2222] text-[#fbebeb] font-sans text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-md shadow-md'>
            {' '}
            EXCLUSIVE
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
        />{' '}
        {/* Hover Action Overlay for Desktop */}
        <div className='hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-3'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetails(item)
            }}
            className='flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider bg-surface/90 border border-outline px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-md'
          >
            <Eye size={14} /> Details
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

          <p className='font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-2'>
            {item.description}
          </p>
        </div>{' '}
        {/* Price and Buttons for Mobile + Desktop */}
        <div className='flex items-center justify-between gap-2 pt-3 mt-3 border-t border-outline-variant/15'>
          <Price
            amount={item.price}
            className='text-sm md:text-base text-primary shrink-0'
          />

          <div className='flex items-center gap-2'>
            {' '}
            {/* Eye for detail (mobile) */}
            <button
              onClick={() => onOpenDetails(item)}
              aria-label='Details'
              className='md:hidden p-2 text-on-surface-variant hover:text-primary bg-surface-container-high rounded-none transition-colors'
            >
              <Eye size={16} />
            </button>{' '}
            {/* Order button (Shown only if the item is orderable: isOrderable === true) */}
            {item.isOrderable ? (
              <button
                onClick={() => handleAddToCart(item)}
                disabled={!item.isAvailable}
                className={`flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-none transition-all duration-200 active:scale-95 ${
                  isItemAdded
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent text-foreground border border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
                } ${!item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isItemAdded ? (
                  <>
                    <Check size={14} />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Order</span>
                  </>
                )}
              </button>
            ) : (
              <p className='font-sans text-[10px] text-muted-foreground'>
                {' '}
                only in restaurant*
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard
