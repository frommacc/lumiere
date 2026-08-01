'use client'
import { MenuItemWithRelations } from '@/types/menu-item'
import MenuItemCard from './MenuItem'

interface MenuListGridProps {
  items: MenuItemWithRelations[]
  isItemAdded: (itemId: string) => boolean
  onOpenDetails: (item: MenuItemWithRelations) => void
  handleAddToCart: (item: MenuItemWithRelations) => void
}

const MenuListGrid = ({
  items,
  isItemAdded,
  onOpenDetails,
  handleAddToCart,
}: MenuListGridProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-10 px-4 md:px-0'>
      {items.map((item, index) => (
        <MenuItemCard
          key={item.id}
          item={item}
          isLcpCandidate={index === 0}
          isItemAdded={isItemAdded(item.id)}
          onOpenDetails={onOpenDetails}
          handleAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}

export default MenuListGrid
