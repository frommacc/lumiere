import { calculateDeliveryFee } from '@/lib/constants/delivery'
import { DeliveryMethod, PaymentMethod } from '@/lib/generated/prisma'
import { CartItem, toCartMenuItem } from '@/types/default'
import { MenuItemWithRelations } from '@/types/menu-item'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  _hasHydrated: boolean // 1. Следење дали е вчитано од localStorage
  setHasHydrated: (state: boolean) => void

  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  deliveryMethod: DeliveryMethod
  setDeliveryMethod: (method: DeliveryMethod) => void

  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void

  cart: CartItem[]
  addItem: (menuItem: MenuItemWithRelations) => void
  updateQuantity: (itemId: string, newQuantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void

  getTotalPrice: () => number
  getTotalCount: () => number
  getDeliveryFee: (method?: DeliveryMethod) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      deliveryMethod: 'ADDRESS',
      setDeliveryMethod: (method: DeliveryMethod) =>
        set({ deliveryMethod: method }),

      paymentMethod: 'CARD',
      setPaymentMethod: (method: PaymentMethod) =>
        set({ paymentMethod: method }),

      cart: [],

      addItem: (fullItem: MenuItemWithRelations) =>
        set((state) => {
          const minimalItem = toCartMenuItem(fullItem)
          const existingIndex = state.cart.findIndex(
            (item) => item.menuItem.id === minimalItem.id,
          )

          if (existingIndex > -1) {
            const updatedCart = state.cart.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
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

      clearCart: () =>
        set({ cart: [], deliveryMethod: 'ADDRESS', paymentMethod: 'CARD' }),

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0,
        )
      },
      getTotalCount: () => {
        return get().cart.reduce((acc, item) => acc + item.quantity, 0)
      },
      getDeliveryFee: (method?: DeliveryMethod) => {
        const itemsTotal = get().getTotalPrice()
        const selectedMethod = method || get().deliveryMethod
        return calculateDeliveryFee(itemsTotal, selectedMethod)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
        deliveryMethod: state.deliveryMethod,
        paymentMethod: state.paymentMethod,
      }),
      // 2. Се повикува кога завршува или започнува процесот на хидратација од localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
