import { create } from 'zustand'

type DesktopMenuStore = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useDesktopMenu = create<DesktopMenuStore>((set) => ({
  isOpen: false,
  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      shouldFocusSearch: false,
    })),
  close: () =>
    set(() => ({
      isOpen: false,
    })),
}))
