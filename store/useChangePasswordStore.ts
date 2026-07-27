import { create } from 'zustand'

type ChangePasswordState = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useChangePasswordStore = create<ChangePasswordState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
