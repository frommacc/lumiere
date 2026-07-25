import {
  CartItem,
  MenuItemWithRelations,
  toCartMenuItem,
} from '@/types/default'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  cart: CartItem[]
  addItem: (menuItem: MenuItemWithRelations) => void
  updateQuantity: (itemId: string, newQuantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      cart: [],

      addItem: (fullItem: MenuItemWithRelations) =>
        set((state) => {
          const minimalItem = toCartMenuItem(fullItem)
          const existingIndex = state.cart.findIndex(
            (item) => item.menuItem.id === minimalItem.id,
          )

          if (existingIndex > -1) {
            const updatedCart = [...state.cart]
            updatedCart[existingIndex].quantity += 1
            return { cart: updatedCart, isOpen: true }
          }

          return {
            cart: [...state.cart, { menuItem: minimalItem, quantity: 1 }],
            isOpen: true,
          }
        }),

      updateQuantity: (itemId: string, newQuantity: number) =>
        set((state) => {
          if (newQuantity <= 0) {
            return {
              cart: state.cart.filter((item) => item.menuItem.id !== itemId),
            }
          }
          return {
            cart: state.cart.map((item) =>
              item.menuItem.id === itemId
                ? { ...item, quantity: newQuantity }
                : item,
            ),
          }
        }),

      removeItem: (itemId: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.menuItem.id !== itemId),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
)
