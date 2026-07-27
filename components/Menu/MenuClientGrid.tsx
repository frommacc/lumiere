'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import { useCartStore } from '@/store/useCartStore'
import { MenuItemWithRelations } from '@/types/default'
import MenuItemCard from './MenuItem'
import IngredientModal from './IngredientModal'

interface MenuClientGridProps {
  items: MenuItemWithRelations[]
}

export default function MenuClientGrid({ items }: MenuClientGridProps) {
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})
  const [selectedProvenanceItem, setSelectedProvenanceItem] =
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isLcpCandidate={index === 0}
              isItemAdded={!!addedItemIds[item.id]}
              onOpenProvenance={(i) => setSelectedProvenanceItem(i)}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </AnimatePresence>
      </div>

      <IngredientModal
        item={selectedProvenanceItem}
        isOpen={!!selectedProvenanceItem}
        onClose={() => setSelectedProvenanceItem(null)}
      />
    </>
  )
}
