import { create } from 'zustand'

interface EditProfileState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useEditProfileStore = create<EditProfileState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
