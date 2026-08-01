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

    // Додаваме визуелен фидбек за конкретниот артикал
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }))

    // По минување на дефинираното време го враќаме копчето во првобитна состојба
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }))
    }, feedbackDuration)
  }

  // Помошна функција да провериш дали специфичен артикал е додаден
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
