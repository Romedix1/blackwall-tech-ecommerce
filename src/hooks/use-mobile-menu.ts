import { create } from 'zustand'

type MobileMenuStore = {
  isOpen: boolean
  shouldFocusSearch: boolean
  focusTrigger: number
  onOpen: (withFocus?: boolean) => void
  toggle: () => void
}

export const useMobileMenu = create<MobileMenuStore>((set) => ({
  isOpen: false,
  shouldFocusSearch: false,
  focusTrigger: 0,

  onOpen: (withFocus = false) =>
    set((state) => ({
      isOpen: true,
      shouldFocusSearch: withFocus,
      focusTrigger: withFocus ? state.focusTrigger + 1 : state.focusTrigger,
    })),
  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      shouldFocusSearch: false,
    })),
}))
