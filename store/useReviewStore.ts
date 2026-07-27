import { create } from 'zustand'

type ReviewState = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useReviewStore = create<ReviewState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
