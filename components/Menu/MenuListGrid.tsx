'use client'

import { MenuItemWithRelations } from '@/types/menu-item'
import MenuItemCard from './MenuItem'

interface MenuListGridProps {
  items: MenuItemWithRelations[]
  isItemAdded: (itemId: string) => boolean
  onOpenDetails: (item: MenuItemWithRelations) => void
  handleAddToCart: (item: MenuItemWithRelations) => void
  horizontalScroll?: boolean
}

const MenuListGrid = ({
  items,
  isItemAdded,
  onOpenDetails,
  handleAddToCart,
  horizontalScroll = false,
}: MenuListGridProps) => {
  return (
    <div
      className={
        horizontalScroll
          ? // Horizontal Scroll Snap for Mobile -> Grid from md: up
            'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-2 px-4 no-scrollbar -mx-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-10 md:pb-0 md:overflow-visible'
          : // Default Grid for all screens
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-10 px-4 md:px-0'
      }
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={
            horizontalScroll
              ? // Tab width on mobile (80% of screen to view next tab)
                'w-[82vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none'
              : 'w-full'
          }
        >
          <MenuItemCard
            item={item}
            isLcpCandidate={index === 0}
            isItemAdded={isItemAdded(item.id)}
            onOpenDetails={onOpenDetails}
            handleAddToCart={handleAddToCart}
          />
        </div>
      ))}
    </div>
  )
}

export default MenuListGrid
