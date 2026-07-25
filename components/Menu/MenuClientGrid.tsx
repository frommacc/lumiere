'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

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
      <motion.div
        layout
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'
      >
        <AnimatePresence mode='popLayout'>
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isItemAdded={!!addedItemIds[item.id]}
              onOpenProvenance={(i) => setSelectedProvenanceItem(i)}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <IngredientModal
        item={selectedProvenanceItem}
        isOpen={!!selectedProvenanceItem}
        onClose={() => setSelectedProvenanceItem(null)}
      />
    </>
  )
}
