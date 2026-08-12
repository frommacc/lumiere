import { useCartStore } from '@/store/useCartStore'
import { MenuItemWithRelations } from '@/types/menu-item'
import { useState } from 'react'

export function useAddToCart(feedbackDuration = 3000) {
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<MenuItemWithRelations | null>(null)

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: MenuItemWithRelations) => {
    addItem(item)

    // We add visual feedback for the specific item
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))

    // After the defined time has passed, we return the button to its original state
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, feedbackDuration)
  }

  // A helper function to check if a specific item has been added
  const isItemAdded = (itemId: string) => Boolean(addedItemIds[itemId])

  return {
    handleAddToCart,
    isItemAdded,
    selectedMenuItem,
    setSelectedMenuItem,
    onOpenDetails: setSelectedMenuItem,
    onCloseDetails: () => setSelectedMenuItem(null),
  }
}
