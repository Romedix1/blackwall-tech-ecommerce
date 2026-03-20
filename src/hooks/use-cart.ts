import { saveCartInDb } from '@/lib/actions/cart'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  slug: string
  name: string
  price: number
  quantity: number
  imgSrc: string
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  toggle: () => void
  addItem: (
    slug: string,
    name: string,
    price: number,
    quantity: number,
    imgSrc: string,
    isLoggedIn?: boolean,
  ) => Promise<void>
  updateQuantity: (
    slug: string,
    quantity: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  removeItem: (slug: string, isLoggedIn?: boolean) => Promise<void>
  setCart: (items: CartItem[]) => void
}

let timeoutId: ReturnType<typeof setTimeout>

const debouncedSaveToDb = (items: CartItem[]) => {
  clearTimeout(timeoutId)

  timeoutId = setTimeout(async () => {
    try {
      const itemsToSave = items.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))
      await saveCartInDb(itemsToSave)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ CART_SYNC_ERROR ]: ', error)
      }
    }
  }, 1000)
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),
      setCart: (items) => set({ items }),
      addItem: async (
        slug,
        name,
        price,
        quantity,
        imgSrc,
        isLoggedIn = false,
      ) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.slug === slug)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.slug === slug
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          })
        } else {
          set({
            items: [...currentItems, { slug, name, price, quantity, imgSrc }],
          })
        }

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },

      updateQuantity: async (slug, quantity, isLoggedIn = false) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        }))

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },

      removeItem: async (slug, isLoggedIn = false) => {
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        }))

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
