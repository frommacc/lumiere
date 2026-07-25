import { create } from 'zustand'

interface ReservationState {
  isOpen: boolean
  openReservation: () => void
  closeReservation: () => void
}

export const useReservationStore = create<ReservationState>((set) => ({
  isOpen: false,
  openReservation: () => set({ isOpen: true }),
  closeReservation: () => set({ isOpen: false }),
}))
