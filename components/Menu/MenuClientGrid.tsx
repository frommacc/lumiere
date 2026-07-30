'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import { useCartStore } from '@/store/useCartStore'
import { MenuItemWithRelations } from '@/types/default'
import MenuItemCard from './MenuItem'
import MenuItemDetails from './MenuItemDetails'

interface MenuClientGridProps {
  items: MenuItemWithRelations[]
}

export default function MenuClientGrid({ items }: MenuClientGridProps) {
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<MenuItemWithRelations | null>(null)

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: MenuItemWithRelations) => {
    addItem(item)
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, 1500)
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-10 px-4 md:px-0'>
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isLcpCandidate={index === 0}
              isItemAdded={!!addedItemIds[item.id]}
              onOpenDetails={(i) => setSelectedMenuItem(i)}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </AnimatePresence>
      </div>

      <MenuItemDetails
        item={selectedMenuItem}
        isOpen={!!selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />
    </>
  )
}
